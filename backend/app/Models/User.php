<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';  // nama tabel kamu

    protected $fillable = [
        'name',
        'email',
        'job_title',
        'department',
        'status',
        'created_at',
    ];

    public $timestamps = false; // tabelmu tidak punya updated_at
}
