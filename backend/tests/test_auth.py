import uuid

from app.core.security import hash_password
from app.models.client import Client
from app.models.staff import Staff


def _create_staff(db_session, email="attorney@mohlakoana.co.za", password="s3cure-pass"):
    staff = Staff(email=email, hashed_password=hash_password(password), full_name="Test Attorney")
    db_session.add(staff)
    db_session.commit()
    return staff


def test_staff_login_succeeds_with_correct_credentials(client, db_session):
    _create_staff(db_session, password="s3cure-pass")

    response = client.post("/api/v1/auth/staff/login", json={"email": "attorney@mohlakoana.co.za", "password": "s3cure-pass"})

    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body


def test_staff_login_rejects_wrong_password(client, db_session):
    _create_staff(db_session, password="s3cure-pass")

    response = client.post("/api/v1/auth/staff/login", json={"email": "attorney@mohlakoana.co.za", "password": "wrong"})

    assert response.status_code == 401


def test_client_and_matter_creation_end_to_end(client, db_session):
    _create_staff(db_session, password="s3cure-pass")
    login = client.post(
        "/api/v1/auth/staff/login", json={"email": "attorney@mohlakoana.co.za", "password": "s3cure-pass"}
    )
    staff_token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {staff_token}"}

    client_resp = client.post(
        "/api/v1/clients",
        json={"email": "client@example.com", "full_name": "Jane Client", "phone": "0123456789"},
        headers=headers,
    )
    assert client_resp.status_code == 201
    client_id = client_resp.json()["id"]

    matter_resp = client.post(
        "/api/v1/matters",
        json={"client_id": client_id, "reference": "MAT-0001", "title": "CCMA dispute"},
        headers=headers,
    )
    assert matter_resp.status_code == 201
    assert matter_resp.json()["status"] == "opened"

    invite_resp = client.post(f"/api/v1/clients/{client_id}/invite", headers=headers)
    assert invite_resp.status_code == 200
    invite_token = invite_resp.json()["invite_token"]

    accept_resp = client.post(
        "/api/v1/auth/client/accept-invite", json={"invite_token": invite_token, "password": "client-pass-1"}
    )
    assert accept_resp.status_code == 200
    client_access_token = accept_resp.json()["access_token"]

    client_login = client.post(
        "/api/v1/auth/client/login", json={"email": "client@example.com", "password": "client-pass-1"}
    )
    assert client_login.status_code == 200

    my_matters = client.get(
        "/api/v1/matters/mine", headers={"Authorization": f"Bearer {client_access_token}"}
    )
    assert my_matters.status_code == 200
    assert len(my_matters.json()) == 1
    matter_id = my_matters.json()[0]["id"]
    assert my_matters.json()[0]["reference"] == "MAT-0001"

    client_headers = {"Authorization": f"Bearer {client_access_token}"}
    detail_resp = client.get(f"/api/v1/matters/mine/{matter_id}", headers=client_headers)
    assert detail_resp.status_code == 200
    assert detail_resp.json()["reference"] == "MAT-0001"

    other_client_resp = client.post(
        "/api/v1/clients",
        json={"email": "other-client@example.com", "full_name": "Other Client"},
        headers=headers,
    )
    other_matter_resp = client.post(
        "/api/v1/matters",
        json={"client_id": other_client_resp.json()["id"], "reference": "MAT-0002", "title": "Contract dispute"},
        headers=headers,
    )
    other_matter_id = other_matter_resp.json()["id"]

    cross_client_resp = client.get(f"/api/v1/matters/mine/{other_matter_id}", headers=client_headers)
    assert cross_client_resp.status_code == 404


def test_password_reset_flow(client, db_session):
    _create_staff(db_session, password="s3cure-pass")
    login = client.post(
        "/api/v1/auth/staff/login", json={"email": "attorney@mohlakoana.co.za", "password": "s3cure-pass"}
    )
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    client_resp = client.post(
        "/api/v1/clients",
        json={"email": "reset-client@example.com", "full_name": "Reset Client"},
        headers=headers,
    )
    client_id = client_resp.json()["id"]
    invite_token = client.post(f"/api/v1/clients/{client_id}/invite", headers=headers).json()["invite_token"]
    client.post("/api/v1/auth/client/accept-invite", json={"invite_token": invite_token, "password": "first-pass"})

    reset_request = client.post("/api/v1/auth/client/request-password-reset", json={"email": "reset-client@example.com"})
    assert reset_request.status_code == 202

    db_session.expire_all()
    stored_client = db_session.get(Client, uuid.UUID(client_id))
    reset_token = stored_client.invite_token
    assert reset_token is not None

    reset_resp = client.post(
        "/api/v1/auth/client/reset-password", json={"invite_token": reset_token, "password": "second-pass"}
    )
    assert reset_resp.status_code == 200

    old_password_login = client.post(
        "/api/v1/auth/client/login", json={"email": "reset-client@example.com", "password": "first-pass"}
    )
    assert old_password_login.status_code == 401

    new_password_login = client.post(
        "/api/v1/auth/client/login", json={"email": "reset-client@example.com", "password": "second-pass"}
    )
    assert new_password_login.status_code == 200


def test_password_reset_request_does_not_leak_account_existence(client):
    known = client.post("/api/v1/auth/client/request-password-reset", json={"email": "nobody@example.com"})
    assert known.status_code == 202
    assert "invite_token" not in known.json()


def test_contact_form_creates_client_without_auth(client):
    response = client.post(
        "/api/v1/public/contact", json={"email": "lead@example.com", "full_name": "New Lead"}
    )
    assert response.status_code == 201
    assert response.json()["email"] == "lead@example.com"
