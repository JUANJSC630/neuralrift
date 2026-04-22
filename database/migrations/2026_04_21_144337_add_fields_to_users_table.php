<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // add_fields_to_users_table
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->text('bio')->nullable()->after('avatar');
            $table->string('twitter')->nullable()->after('bio');
            $table->string('linkedin')->nullable()->after('twitter');
            $table->string('website')->nullable()->after('linkedin');
            $table->enum('role', ['admin', 'editor', 'author'])->default('author')->after('website');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'bio', 'twitter', 'linkedin', 'website', 'role']);
        });
    }
};
