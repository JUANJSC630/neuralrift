<?php

namespace App\Repositories;

use App\Models\Affiliate;
use App\Repositories\Contracts\AffiliateRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AffiliateRepository implements AffiliateRepositoryInterface
{
    public function getActive(): Collection
    {
        return Affiliate::where('active', true)->orderByDesc('featured')->orderBy('name')->get();
    }

    public function getActiveGroupedByCategory(): Collection
    {
        return $this->getActive();
    }

    public function findOrFail(int $id): Affiliate
    {
        return Affiliate::findOrFail($id);
    }

    public function getAdminPaginated(int $perPage = 15): mixed
    {
        return Affiliate::latest()->paginate($perPage)->withQueryString();
    }
}
