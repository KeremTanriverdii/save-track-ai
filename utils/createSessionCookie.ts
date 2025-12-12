export const createSessionCookie = async (token: string) => {
    const response = await fetch('/api/sessionLogin', {
        method: 'POST',
        headers: {
            // Token'ı Authorization başlığında taşıyoruz
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error("Don't create session cookie.");
    }
};