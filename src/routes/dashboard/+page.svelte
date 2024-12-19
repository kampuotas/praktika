<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<main>
    <!-- <h1>Nuorodos</h1> -->
    <a class="text-blue-500 underline" href="/dashboard/grades">Pažymiai</a><br>
    <a class="text-blue-500 underline" href="/dashboard/users">Vartotojai</a><br>
    <a class="text-blue-500 underline" href="/dashboard/subjects">Dalykai</a><br>
    <a class="text-blue-500 underline" href="/dashboard/groups">Grupės</a><br>
    <a class="text-blue-500 underline" href="/dashboard/grade">Įvertinti</a>
</main>