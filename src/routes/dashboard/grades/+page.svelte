<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    console.log(data);
</script>

<main>
    <center><h1>Paskutiniai pažymiai</h1></center>
    <table class="w-full text-left table-auto min-w-max">
        <thead class="border border-gray-400">
            <tr>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Data ir Laikas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Dalyko pavadinimas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Mokytojas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Pažymys</th>
            </tr>
        </thead>
        <tbody>
            {#if data.grades.length > 0}
                {#each data.grades as grade}
                    <tr>
                        <td class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">{grade.datetime}</td>
                        <td class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">{grade.subject}</td>
                        <td class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">{grade.teacher}</td>
                        <td class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">{grade.grade}</td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td class="p-4 text-center" colspan="6">No grades found</td>
                </tr>
            {/if}
        </tbody>
    </table>
</main>