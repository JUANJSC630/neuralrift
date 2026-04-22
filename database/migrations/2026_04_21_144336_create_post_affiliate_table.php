<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // create_post_affiliate_table
    public function up(): void
    {
        Schema::create('affiliate_post', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('affiliate_id')->constrained()->onDelete('cascade');
            $table->primary(['post_id', 'affiliate_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_post');
    }
};
