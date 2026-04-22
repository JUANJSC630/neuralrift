<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->index(['status', 'published_at'], 'posts_status_published_at_idx');
            $table->index(['category_id', 'status'], 'posts_category_status_idx');
            $table->index(['featured', 'status', 'published_at'], 'posts_featured_status_published_idx');
        });

        Schema::table('post_views', function (Blueprint $table) {
            $table->index(['post_id', 'viewed_at'], 'post_views_post_viewed_idx');
            $table->index('viewed_at', 'post_views_viewed_at_idx');
        });

        Schema::table('affiliate_clicks', function (Blueprint $table) {
            $table->index(['affiliate_id', 'clicked_at'], 'affiliate_clicks_aff_clicked_idx');
            $table->index('clicked_at', 'affiliate_clicks_clicked_at_idx');
        });

        Schema::table('subscribers', function (Blueprint $table) {
            $table->index(['confirmed', 'lang'], 'subscribers_confirmed_lang_idx');
            $table->index('confirmed_at', 'subscribers_confirmed_at_idx');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex('posts_status_published_at_idx');
            $table->dropIndex('posts_category_status_idx');
            $table->dropIndex('posts_featured_status_published_idx');
        });

        Schema::table('post_views', function (Blueprint $table) {
            $table->dropIndex('post_views_post_viewed_idx');
            $table->dropIndex('post_views_viewed_at_idx');
        });

        Schema::table('affiliate_clicks', function (Blueprint $table) {
            $table->dropIndex('affiliate_clicks_aff_clicked_idx');
            $table->dropIndex('affiliate_clicks_clicked_at_idx');
        });

        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropIndex('subscribers_confirmed_lang_idx');
            $table->dropIndex('subscribers_confirmed_at_idx');
        });
    }
};
