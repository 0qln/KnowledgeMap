import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Login({ }) {
    return (
        <GuestLayout>
            <Head title="Log in" />

            <PrimaryButton 
                onClick={() => document.getElementById("microsoft-login").click()}>
                Login with Entra ID
                <a href="/auth/redirect" id="microsoft-login" className="btn btn-primary"/>
            </PrimaryButton>
        </GuestLayout>
    );
}
