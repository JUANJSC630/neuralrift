<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // create_affiliates_table
    public function up(): void
    {
        Schema::create('affiliates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('url');
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->text('description_en')->nullable();
            $table->string('commission')->nullable();
            $table->enum('commission_type', ['recurring', 'one_time', 'percentage'])
                ->default('one_time');
            $table->decimal('commission_value', 8, 2)->nullable();
            $table->string('cookie_duration')->nullable();
            $table->json('pros')->nullable();
            $table->json('cons')->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->string('category')->nullable();
            $table->string('badge')->nullable();
            $table->boolean('active')->default(true);
            $table->boolean('featured')->default(false);
            $table->integer('clicks_count')->default(0);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliates');
    }
};
