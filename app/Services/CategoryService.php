<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $categories,
    ) {}

    public function getAll(): Collection
    {
        return $this->categories->getAll();
    }

    public function getWithPostCounts(): Collection
    {
        return $this->categories->getWithPostCounts();
    }

    public function findBySlug(string $slug): Category
    {
        return $this->categories->findBySlug($slug);
    }

    public function findOrFail(int $id): Category
    {
        return $this->categories->findOrFail($id);
    }
}
