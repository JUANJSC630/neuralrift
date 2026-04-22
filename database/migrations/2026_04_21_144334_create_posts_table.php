<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // create_posts_table
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('title_en')->nullable();
            $table->string('slug')->unique();
            $table->string('slug_en')->unique()->nullable();
            $table->text('excerpt')->nullable();
            $table->text('excerpt_en')->nullable();
            $table->longText('content')->nullable();
            $table->longText('content_en')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('og_image')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->enum('status', ['draft', 'review', 'scheduled', 'published'])
                ->default('draft');
            $table->enum('lang', ['es', 'en', 'both'])->default('es');
            $table->timestamp('published_at')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('allow_comments')->default(true);
            $table->boolean('indexable')->default(true);
            $table->integer('read_time')->default(0);
            $table->integer('views_count')->default(0);
            $table->json('schema_markup')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->index(['category_id', 'status']);
            $table->index('featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
