<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    public function getAll(): Collection;

    public function getWithPostCounts(): Collection;

    public function findBySlug(string $slug): Category;

    public function findOrFail(int $id): Category;
}
