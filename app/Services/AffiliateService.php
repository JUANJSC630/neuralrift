<?php

namespace App\Services;

use App\Models\Affiliate;
use App\Repositories\Contracts\AffiliateRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AffiliateService
{
    public function __construct(
        private AffiliateRepositoryInterface $affiliates,
    ) {}

    public function getActive(): Collection
    {
        return $this->affiliates->getActive();
    }

    public function getActiveGroupedByCategory(): Collection
    {
        return $this->affiliates->getActiveGroupedByCategory();
    }

    public function findOrFail(int $id): Affiliate
    {
        return $this->affiliates->findOrFail($id);
    }

    public function getAdminPaginated(int $perPage = 15): mixed
    {
        return $this->affiliates->getAdminPaginated($perPage);
    }
}
