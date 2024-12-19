<script lang="ts">
    import type { LayoutData } from './$types';
    import { goto } from '$app/navigation';

    export let data: LayoutData;

    async function logout() {
        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            goto('/');
        } else {
            console.error('Failed to log out.');
        }
    }
</script>

<header class="flex items-center justify-between bg-gray-300 border-b border-gray-200 py-3 px-6">
    <button class="text-gray-800 hover:text-red-700 font-semibold ml-auto" on:click={logout}>
      Atsijungti
    </button>
</header>

<div class="flex h-screen overflow-hidden">
    <nav class="border-r bg-gray-100 border-gray-200 w-64 p-4 overflow-y-auto">
      <ul class="space-y-2">
        {#if data && data.role}
          {#if data.role == "Admin"}
            <li>
              <a href="/dashboard/" class="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded">
                Pagrindinis
              </a>
            </li>
            <li>
              <a href="/dashboard/users" class="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded">
                Vartotojai
              </a>
            </li>
            <li>
              <a href="/dashboard/subjects" class="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded">
                Dalykai
              </a>
            </li>
            <li>
              <a href="/dashboard/groups" class="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded">
                Grupės
              </a>
            </li>
          {/if}
          {#if data.role == "Admin" || data.role == "Teacher"}
            <li>
              <a href="/dashboard/grade" class="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded">
                Įvertinti
              </a>
            </li>  
          {/if}
        {/if}    
      </ul>
    </nav>

    <main class="flex-1 p-6 overflow-y-auto bg-white">
        <slot></slot>
    </main>
</div>
