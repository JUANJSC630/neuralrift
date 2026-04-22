<?php

namespace App\Policies;

use App\Models\Affiliate;
use App\Models\User;

class AffiliatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Affiliate $affiliate): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Affiliate $affiliate): bool
    {
        return $user->role === 'admin';
    }
}
