const API_URL = 'http://localhost:5000/api';

async function verify() {
    console.log("Starting Verification...");

    // 1. Login as Admin
    console.log("\n1. Logging in as Admin...");
    const adminLogin = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin1', password: 'director2026' })
    });
    const adminData = await adminLogin.json();
    if (!adminData.token) throw new Error("Admin login failed");
    console.log("✅ Admin logged in.");

    // 2. Create New User
    console.log("\n2. Creating Test User...");
    const createUser = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminData.token}`
        },
        body: JSON.stringify({ username: 'test_lead_99', password: 'password123', role: 'lead' })
    });
    const newUser = await createUser.json();
    if (!newUser.id) {
        console.error(newUser);
        throw new Error("User creation failed");
    }
    console.log("✅ User 'test_lead_99' created.");

    // 3. Toggle Permissions
    console.log("\n3. Toggling Review Access...");
    const toggle = await fetch(`${API_URL}/users/${newUser.id}/permissions`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminData.token}`
        },
        body: JSON.stringify({ canViewReviews: true })
    });
    const toggleData = await toggle.json();
    if (toggleData.canViewReviews !== true) throw new Error("Permission toggle failed");
    console.log("✅ Permission granted: canViewReviews=true");

    // 4. Verify User Login & Permission
    console.log("\n4. Verifying User Login & Permissions...");
    const userLogin = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test_lead_99', password: 'password123' })
    });
    const userData = await userLogin.json();
    if (!userData.user.canViewReviews) throw new Error("User login did not reflect new permissions");
    console.log("✅ User logged in with correct permissions.");

    // 5. Delete User
    console.log("\n5. Deleting User...");
    const deleteReq = await fetch(`${API_URL}/users/${newUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminData.token}` }
    });
    if (deleteReq.status !== 200) throw new Error("Delete failed");
    console.log("✅ User deleted.");

    console.log("\n🎉 ALL TESTS PASSED");
}

verify().catch(e => {
    console.error("\n❌ TEST FAILED:", e.message);
    process.exit(1);
});
