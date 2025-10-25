from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json

from app.core.database import get_db, Group, GroupMember, SharedAccount, redis_client

router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_groups(db: Session = Depends(get_db)):
    """Get all groups"""
    try:
        cache_key = "groups:all"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        # Fetch groups from database
        groups = db.query(Group).all()
        groups_data = []
        
        for group in groups:
            # Get members
            members = db.query(GroupMember).filter(GroupMember.group_id == group.group_id).all()
            members_data = [
                {
                    "id": member.member_id,
                    "name": member.name,
                    "email": member.email,
                    "role": member.role
                }
                for member in members
            ]
            
            # Get shared accounts
            shared_accounts = db.query(SharedAccount).filter(SharedAccount.group_id == group.group_id).all()
            accounts_data = [
                {
                    "id": account.account_id,
                    "accountType": account.account_type,
                    "nickname": account.nickname,
                    "balance": account.balance,
                    "accountNumber": account.account_number,
                    "permissions": json.loads(account.permissions) if account.permissions else []
                }
                for account in shared_accounts
            ]
            
            group_data = {
                "id": group.group_id,
                "name": group.name,
                "description": group.description,
                "type": group.type,
                "icon": group.icon,
                "color": group.color,
                "members": members_data,
                "sharedAccounts": accounts_data,
                "totalBalance": group.total_balance,
                "createdAt": group.created_at.isoformat(),
                "lastActivity": group.updated_at.isoformat(),
                "settings": {
                    "allowMemberInvites": True,
                    "requireApproval": True,
                    "visibility": "private"
                }
            }
            groups_data.append(group_data)
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(groups_data, default=str))
        
        return groups_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching groups: {str(e)}")

@router.get("/{group_id}", response_model=Dict[str, Any])
async def get_group(group_id: str, db: Session = Depends(get_db)):
    """Get a specific group by ID"""
    try:
        cache_key = f"group:{group_id}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return json.loads(cached_data)
        
        group = db.query(Group).filter(Group.group_id == group_id).first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        
        # Get members and accounts (similar to get_groups)
        members = db.query(GroupMember).filter(GroupMember.group_id == group_id).all()
        shared_accounts = db.query(SharedAccount).filter(SharedAccount.group_id == group_id).all()
        
        group_data = {
            "id": group.group_id,
            "name": group.name,
            "description": group.description,
            "type": group.type,
            "icon": group.icon,
            "color": group.color,
            "members": [
                {
                    "id": member.member_id,
                    "name": member.name,
                    "email": member.email,
                    "role": member.role
                }
                for member in members
            ],
            "sharedAccounts": [
                {
                    "id": account.account_id,
                    "accountType": account.account_type,
                    "nickname": account.nickname,
                    "balance": account.balance,
                    "accountNumber": account.account_number,
                    "permissions": json.loads(account.permissions) if account.permissions else []
                }
                for account in shared_accounts
            ],
            "totalBalance": group.total_balance,
            "createdAt": group.created_at.isoformat(),
            "lastActivity": group.updated_at.isoformat(),
            "settings": {
                "allowMemberInvites": True,
                "requireApproval": True,
                "visibility": "private"
            }
        }
        
        # Cache for 5 minutes
        redis_client.setex(cache_key, 300, json.dumps(group_data, default=str))
        
        return group_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching group: {str(e)}")

@router.post("/", response_model=Dict[str, Any])
async def create_group(group_data: Dict[str, Any], db: Session = Depends(get_db)):
    """Create a new group"""
    try:
        # Create group
        new_group = Group(
            group_id=group_data["id"],
            name=group_data["name"],
            description=group_data["description"],
            type=group_data["type"],
            icon=group_data["icon"],
            color=group_data["color"],
            total_balance=group_data.get("totalBalance", 0)
        )
        db.add(new_group)
        
        # Add members
        for member_data in group_data.get("members", []):
            member = GroupMember(
                group_id=group_data["id"],
                member_id=member_data["id"],
                name=member_data["name"],
                email=member_data["email"],
                role=member_data["role"]
            )
            db.add(member)
        
        # Add shared accounts
        for account_data in group_data.get("sharedAccounts", []):
            account = SharedAccount(
                group_id=group_data["id"],
                account_id=account_data["id"],
                account_type=account_data["accountType"],
                nickname=account_data["nickname"],
                balance=account_data["balance"],
                account_number=account_data["accountNumber"],
                permissions=json.dumps(account_data.get("permissions", []))
            )
            db.add(account)
        
        db.commit()
        
        # Clear cache
        redis_client.delete("groups:all")
        
        return group_data
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating group: {str(e)}")

@router.put("/{group_id}", response_model=Dict[str, Any])
async def update_group(group_id: str, group_data: Dict[str, Any], db: Session = Depends(get_db)):
    """Update a group"""
    try:
        group = db.query(Group).filter(Group.group_id == group_id).first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        
        # Update group fields
        group.name = group_data.get("name", group.name)
        group.description = group_data.get("description", group.description)
        group.type = group_data.get("type", group.type)
        group.icon = group_data.get("icon", group.icon)
        group.color = group_data.get("color", group.color)
        group.total_balance = group_data.get("totalBalance", group.total_balance)
        
        db.commit()
        
        # Clear cache
        redis_client.delete("groups:all")
        redis_client.delete(f"group:{group_id}")
        
        return {"message": "Group updated successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error updating group: {str(e)}")

@router.delete("/{group_id}")
async def delete_group(group_id: str, db: Session = Depends(get_db)):
    """Delete a group"""
    try:
        group = db.query(Group).filter(Group.group_id == group_id).first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        
        # Delete related records
        db.query(GroupMember).filter(GroupMember.group_id == group_id).delete()
        db.query(SharedAccount).filter(SharedAccount.group_id == group_id).delete()
        db.delete(group)
        
        db.commit()
        
        # Clear cache
        redis_client.delete("groups:all")
        redis_client.delete(f"group:{group_id}")
        
        return {"message": "Group deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error deleting group: {str(e)}")
