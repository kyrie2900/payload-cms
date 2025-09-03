'use client'
import React, { useState } from 'react'

interface UserListModalProps {
  title: string
  users: string[]
  isOpen: boolean
  onClose: () => void
}

const UserListModal: React.FC<UserListModalProps> = ({ title, users, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '16px',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '12px',
        }}>
          总计 {users.length} 个用户
        </div>

        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '6px',
          padding: '16px',
          border: '1px solid #E5E7EB',
        }}>
          {users.map((user, index) => (
            <div
              key={index}
              style={{
                padding: '8px 12px',
                backgroundColor: 'white',
                borderRadius: '4px',
                marginBottom: index < users.length - 1 ? '8px' : '0',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#374151',
                border: '1px solid #E5E7EB',
              }}
            >
              {user}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#4F46E5',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5'
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserListModal