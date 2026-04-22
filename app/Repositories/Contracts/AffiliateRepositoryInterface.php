<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Affiliate;

interface AffiliateRepositoryInterface
{
    public function getActive(): Collection;

    public function getActiveGroupedByCategory(): Collection;

    public function findOrFail(int $id): Affiliate;

    public function getAdminPaginated(int $perPage = 15): mixed;
}
