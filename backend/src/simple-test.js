import axios from 'axios';

const testLogin = async () => {
    try {
        console.log('Testing login endpoint...');
        const response = await axios.post(
            'http://localhost:5000/api/auth/login',
            {
                email: 'customer1@example.com',
                password: '123456'
            }
        );
        console.log('✅ Login successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Login failed!');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
};

testLogin();
