<?php

namespace App\Repositories\Contracts;

use App\Models\Affiliate;
use Illuminate\Database\Eloquent\Collection;

interface AffiliateRepositoryInterface
{
    public function getActive(): Collection;

    public function getActiveGroupedByCategory(): Collection;

    public function findOrFail(int $id): Affiliate;

    public function getAdminPaginated(int $perPage = 15): mixed;
}
