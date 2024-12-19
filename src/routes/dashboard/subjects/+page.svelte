<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;

    console.log(data);

    let editingSubject: any = null;
    let isModalOpen: boolean = false;

    function cancelEdit() {
        editingSubject = null;
    }

    function manageTeachers(subject: any) {
        isModalOpen = true;
        editingSubject = subject;
    }

    async function getTeachers(): Promise<any>{
        if(!editingSubject){
            return;
        }
        const response = await fetch(`/api/subjects/${editingSubject.id}/teachers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const responseData = await response.json();
            return responseData.teachers;
        }
    }

    async function assignTeacher(){
        const teacherElement = document.getElementById('teacher') as HTMLSelectElement;

        if(!teacherElement || !editingSubject){ 
            return;
        }

        if(!teacherElement.value){
            return;
        }

        const teacherId = teacherElement.value;
        
        if(!editingSubject){
            return;
        }
        const response = await fetch(`/api/subjects/${editingSubject.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({teacherId})
        });

        if(response.ok){
            const responseData = await response.json();

            window.location.reload();
        }
    }

    async function removeAssignment(teacherId: number){
        if(!editingSubject){
            return;
        }

        const response = await fetch(`/api/subjects/${editingSubject.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({teacherId})
        });

        if(response.ok){
            const responseData = await response.json();

            window.location.reload();
        }
    }

</script>

<main>
    <center>
        <h2>Pridėti naują mokomajį dalyką</h2>
    </center>

    <form method="post">
        {#if editingSubject && !isModalOpen}
            <input type="hidden" name="id" value={editingSubject.id} />
            <input type="text" name="name" placeholder="Name" value={editingSubject.name} required />
            <button type="submit" name="action" value="update" class="rounded bg-blue-500 py-1 px-4 text-white font-semibold">
                Update
            </button>
            <button type="button" on:click={cancelEdit} class="rounded bg-red-500 py-1 px-4 text-white font-semibold">
                Cancel
            </button>
        {:else}
            <input type="text" name="name" placeholder="Name" required />
            <button type="submit" name="action" value="create" class="rounded bg-blue-500 py-1 px-4 text-white font-semibold">
                Submit
            </button>
        {/if}
    </form>

    <br />

    <center>
        <h2>Visi dalykai</h2>
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
            {#if data.serializedSubjects && data.serializedSubjects.length > 0}
                {#each data.serializedSubjects as subject}
                    <tr>
                        <td class="p-4 border-b border-blue-gray-100">{subject.id}</td>
                        <td class="p-4 border-b border-blue-gray-100">{subject.name}</td>
                        <td class="p-4 border-b border-blue-gray-100">
                            <form method="post" style="display:inline;">
                                <input type="hidden" name="id" value={subject.id} />
                                <button class="rounded bg-red-500 py-1 px-4 text-white font-semibold" type="submit" name="action" value="delete">
                                    Delete
                                </button>
                            </form>
                            <button 
                                class="rounded bg-purple-500 py-1 px-4 text-white font-semibold" 
                                type="button" 
                                on:click={() => manageTeachers(subject)}>
                                Manage Teachers
                            </button>    
                            <button
                                class="rounded bg-yellow-500 py-1 px-4 text-white font-semibold"
                                type="button"
                                on:click={() => {editingSubject = subject}}>
                                Edit
                            </button>
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td class="p-4 text-center" colspan="6">No subject found</td>
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
                        editingSubject = null;
                        isModalOpen = false;
                    }}
                    class="absolute top-[15px] right-[20px] font-black">
                    <svg class="w-[30px] h-[30px]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h1 class="font-bold text-3xl px-[10px] h-max">Mokytojų priskyrimas</h1>
                <div class="lg:max-h-[600px] h-max overflow-auto py-[10px] my-[10px]">
                    <form class="h-max px-[10px] py-[10px] rounded-t-[6px] grid grid-cols-2 lg:grid-cols-1 gap-[10px] lg:gap-0" id="form">
                        <label class="font-bold text-xl mb-2 gap-[10px] flex flex-col" for="teacher">
                            Mokytojai
                            <select class="shadow appearance-none border rounded grow py-2 px-3 focus:outline-none focus:shadow-outline" id="teacher">
                                {#each data.serializedTeachers as teacher}
                                    <option value={teacher.id}>{teacher.fullname}</option>
                                {/each}
                            </select>
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" on:click={() => assignTeacher()}>Priskirti</button>
                        </label>                           
                    </form> 
                    <table class="w-full text-left table-auto min-w-max border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">ID</th>
                                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Vardas</th>
                                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Veiksmai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#await getTeachers() then teachers}
                                {#if teachers && teachers.length > 0}
                                    {#each teachers as teacher}
                                        <tr>
                                            <td class="p-4 border-b border-blue-gray-100">{teacher.id}</td>
                                            <td class="p-4 border-b border-blue-gray-100">{teacher.fullname}</td>
                                            <td>
                                                <button class="rounded bg-red-500 py-1 px-4 text-white font-semibold" type="button" on:click={() => removeAssignment(teacher.id)}>
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    {/each}
                                {:else}
                                    <tr>
                                        <td class="p-4 text-center" colspan="6">No teacher found</td>
                                    </tr>
                                {/if}
                            {/await}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {/if}
    
</main>
