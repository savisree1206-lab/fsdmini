# Club Management System - ER Diagram

This document contains the Entity-Relationship (ER) diagram for the Club Management System database schema. It does not affect any project files.

```mermaid
erDiagram
    users {
        INT id PK
        VARCHAR name
        VARCHAR email
        VARCHAR password
        ENUM role
        TIMESTAMP created_at
    }
    clubs {
        INT id PK
        VARCHAR name
        VARCHAR faculty_incharge
        TEXT description
        VARCHAR logo_url
        TIMESTAMP created_at
    }
    members {
        INT id PK
        INT club_id FK
        VARCHAR name
        VARCHAR email
        ENUM role
        VARCHAR position
        TIMESTAMP joined_at
    }
    join_requests {
        INT id PK
        INT club_id FK
        VARCHAR name
        VARCHAR email
        ENUM applied_position
        TEXT idea
        ENUM status
        TIMESTAMP created_at
    }
    events {
        INT id PK
        INT club_id FK
        VARCHAR title
        TEXT description
        DATETIME event_date
        VARCHAR location
        INT capacity
        TIMESTAMP created_at
    }
    registrations {
        INT id PK
        INT user_id FK
        INT event_id FK
        TIMESTAMP registered_at
        ENUM status
    }

    clubs ||--o{ members : "has"
    clubs ||--o{ join_requests : "receives"
    clubs ||--o{ events : "organizes"
    users ||--o{ registrations : "makes"
    events ||--o{ registrations : "has"
```

## Relationships Details

- **clubs** to **members** (One-to-Many): A club can have many members, but each member record is tied to one specific club.
- **clubs** to **join_requests** (One-to-Many): A club can receive many join requests from prospective members.
- **clubs** to **events** (One-to-Many): A club can organize multiple events.
- **users** to **registrations** (One-to-Many): A user (student/admin) can make multiple registrations for different events.
- **events** to **registrations** (One-to-Many): An event can have multiple user registrations.
