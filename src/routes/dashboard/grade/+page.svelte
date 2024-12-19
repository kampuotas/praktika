<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
    import { onMount } from 'svelte';

    let currentDateTime: string;
    onMount(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    });
    

    let editingGroup: any = null;
    let isModalOpen: boolean = false;

    let gradeStudent: any = null;

    function grade(group: any) {
        isModalOpen = true;
        editingGroup = group;
    }

    async function getStudents(): Promise<any>{
        if(!editingGroup){
            return;
        }
        const response = await fetch(`/api/group/${editingGroup.id}/students`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const responseData = await response.json();
            return responseData.students;
        }
    } 

    async function getStudentGrades(): Promise<any>{
        if(!editingGroup){
            return;
        }
        const response = await fetch(`/api/grades/${editingGroup.id}/${gradeStudent.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const responseData = await response.json();
            responseData.forEach((grade: any) => {
                const date = new Date(grade.datetime);
                grade.datetime = date.toLocaleString();
            });
            return responseData;
        }
    } 

    async function deleteGrade(gradeId: number): Promise<any> {
        if(!editingGroup){
            return;
        }
        const response = await fetch(`/api/grades/${gradeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const responseData = await response.json();
           window.location.reload();
        }
    }
</script>

<main>
    <center>
        <h2>Visos jūsų grupės</h2>
    </center>
    <table class="w-full text-left table-auto min-w-max border-collapse border border-gray-400">
        <thead>
            <tr>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">ID</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Pavadinimas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Veiksmai</th>
            </tr>
        </thead>
        <tbody>
            {#if data.serializedGroups && data.serializedGroups.length > 0}
                {#each data.serializedGroups as group}
                    <tr>
                        <td class="p-4 border-b border-blue-gray-100">{group.id}</td>
                        <td class="p-4 border-b border-blue-gray-100">{group.name}</td>
                        <td class="p-4 border-b border-blue-gray-100">
                            <button 
                                class="rounded bg-purple-500 py-1 px-4 text-white font-semibold" 
                                type="button" 
                                on:click={() => grade(group)}>
                                Grade
                            </button>    
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td class="p-4 text-center" colspan="6">No group found</td>
                </tr>
            {/if}
        </tbody>      
    </table>

    {#if isModalOpen}
        <div class="absolute top-0 left-0 h-full w-full flex items-center justify-center backdrop-blur" style="z-index: 22;">
            <div class="h-[80%] w-[40%] bg-gray-400 text-black rounded-l-[6px] relative p-[20px] flex flex-col">
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button 
                    on:click={() => {
                        editingGroup = null;
                        isModalOpen = false;
                        gradeStudent = null;
                    }}
                    class="absolute top-[15px] right-[20px] font-black">
                    <svg class="w-[30px] h-[30px]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h1 class="font-bold text-3xl px-[10px] h-max">
                    {#if gradeStudent}
                        <button 
                            class="rounded text-xl bg-yellow-500 py-1 px-4 text-white font-semibold" 
                            type="button" 
                            on:click={() => gradeStudent = null}>
                            Atgal 
                        </button>
                    {/if}
                    Studentų įvertinimas
                </h1>
                <div class="lg:max-h-[600px] h-max overflow-auto py-[10px] my-[10px]">
                    {#if gradeStudent}
                        <form class="h-max px-[10px] py-[10px] rounded-t-[6px] grid grid-cols-2 lg:grid-cols-1 gap-[10px] lg:gap-0" method="post"> 
                            <input type="hidden" name="group_id" value={editingGroup.id}>
                            <input type="hidden" name="student_id" value={gradeStudent.id}>
                            <label class="font-bold text-xl mb-2 gap-[10px] flex flex-col" for="datetime">
                                Data ir laikas
                                <input class="shadow appearance-none border rounded grow py-2 px-3 focus:outline-none focus:shadow-outline" bind:value={currentDateTime} type="datetime-local" id="datetime" name="datetime" required> 
                            </label> 
                            <label class="font-bold text-xl mb-2 gap-[10px] flex flex-col" for="grade">
                                Įvertinimas
                                <input class="shadow appearance-none border rounded grow py-2 px-3 focus:outline-none focus:shadow-outline" type="number" id="grade" name="grade" min={1} max={10} required>
                            </label>                 
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="submit" name="action" value="grade">Įvertinti</button>
                        </form><hr><br>
                    {/if}

                    {#if gradeStudent}
                        <h1 class="font-bold text-2xl px-[10px] h-max">Studento <span class="text-2xl text-yellow-200">{gradeStudent.fullname}</span> įvertinimai</h1><br>
                        <table class="w-full text-left table-auto min-w-max border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">ID</th>
                                    <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Data ir Laikas</th>
                                    <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Įvertinimas</th>
                                    <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Veiksmas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#await getStudentGrades() then grades}
                                    {#if grades && grades.length > 0}
                                        {#each grades as grade}
                                            <tr>
                                                <td class="p-4 border-b border-blue-gray-100">{grade.id}</td>
                                                <td class="p-4 border-b border-blue-gray-100">{grade.datetime}</td>
                                                <td class="p-4 border-b border-blue-gray-100">{grade.grade}</td>
                                                <td>
                                                    <button class="rounded bg-red-500 py-1 px-4 text-white font-semibold" type="button" on:click={() => deleteGrade(grade.id)}>
                                                        Ištrinti
                                                    </button>                                                
                                                </td>
                                            </tr>
                                        {/each}
                                    {:else}
                                        <tr>
                                            <td class="p-4 text-center" colspan="6">No grades found</td>
                                        </tr>
                                    {/if}
                                {/await}
                            </tbody>
                        </table>      
                    {/if}
                    
                    {#if !gradeStudent}
                        <table class="w-full text-left table-auto min-w-max border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">ID</th>
                                    <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Studentas</th>
                                    <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Veiksmas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#await getStudents() then students}
                                    {#if students && students.length > 0}
                                        {#each students as student}
                                            <tr>
                                                <td class="p-4 border-b border-blue-gray-100">{student.id}</td>
                                                <td class="p-4 border-b border-blue-gray-100">{student.fullname}</td>
                                                <td>                                              
                                                    <button class="rounded bg-yellow-500 py-1 px-4 text-white font-semibold" type="button" on:click={() => gradeStudent = student}>
                                                        View grades
                                                    </button>
                                                </td>
                                            </tr>
                                        {/each}
                                    {:else}
                                        <tr>
                                            <td class="p-4 text-center" colspan="6">No student found</td>
                                        </tr>
                                    {/if}
                                {/await}
                            </tbody>
                        </table>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
    
</main>
