"""One-off CLI to create the first staff account.

Staff creation has no API endpoint on purpose — there's no bootstrap
problem to solve there, since the first account has to come from
somewhere with direct database access anyway, and an unauthenticated
"create staff" endpoint would be a standing privilege-escalation risk.

Usage: python scripts/seed_admin.py <email> <password> <full_name>
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.staff import Staff


def main() -> None:
    if len(sys.argv) != 4:
        print("Usage: python scripts/seed_admin.py <email> <password> <full_name>")
        raise SystemExit(1)

    email, password, full_name = sys.argv[1], sys.argv[2], sys.argv[3]

    db = SessionLocal()
    try:
        if db.query(Staff).filter(Staff.email == email).first() is not None:
            print(f"Staff with email {email} already exists.")
            raise SystemExit(1)

        staff = Staff(email=email, hashed_password=hash_password(password), full_name=full_name, role="admin")
        db.add(staff)
        db.commit()
        print(f"Created staff account {email} ({staff.id})")
    finally:
        db.close()


if __name__ == "__main__":
    main()
