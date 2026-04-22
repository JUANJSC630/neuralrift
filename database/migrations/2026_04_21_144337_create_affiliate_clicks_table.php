<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // create_affiliate_clicks_table
    public function up(): void
    {
        Schema::create('affiliate_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('affiliate_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip', 45)->nullable();
            $table->string('country', 2)->nullable();
            $table->timestamp('clicked_at');

            $table->index(['affiliate_id', 'clicked_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affiliate_clicks');
    }
};
