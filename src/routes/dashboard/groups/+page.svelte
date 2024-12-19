<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;

    console.log(data);

    let editingGroup: any = null;
    let isModalOpen: boolean = false;

    function cancelEdit() {
        editingGroup = null;
    }

    function manageGroup(group: any) {
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
            // console.log(responseData);
            return responseData.students;
        }
    }

    async function getGroupSubject(): Promise<any>{
        if(!editingGroup){
            return;
        }
        const response = await fetch(`/api/group/${editingGroup.id}/subject`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const responseData = await response.json();
            console.log(responseData);
            return responseData.subject.id;
        }
    }

    async function assignStudent(){
        const studentElement = document.getElementById('students') as HTMLSelectElement;

        if(!studentElement || !editingGroup){ 
            return;
        }

        if(!studentElement.value){
            return;
        }

        const studentId = studentElement.value;
        
        if(!editingGroup){
            return;
        }
        const response = await fetch(`/api/group/${editingGroup.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({studentId})
        });

        if(response.ok){
            const responseData = await response.json();

            window.location.reload();
        }
    }

    async function removeAssignment(studentId: number){
        if(!editingGroup){
            return;
        }

        const response = await fetch(`/api/group/${editingGroup.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({studentId})
        });

        if(response.ok){
            const responseData = await response.json();

            window.location.reload();
        }
    }

    async function assignSubject(){
        const subjectElement = document.getElementById('subject') as HTMLSelectElement;

        if(!subjectElement || !editingGroup){ 
            return;
        }

        if(!subjectElement.value){
            return;
        }

        const subjectId = subjectElement.value;
        
        if(!editingGroup){
            return;
        }
        const response = await fetch(`/api/group/${editingGroup.id}/subject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({subjectId})
        });

        if(response.ok){
            const responseData = await response.json();

            window.location.reload();
        }
    }    
</script>

<main>
    <center>
        <h2>Pridėti naują grupę</h2>
    </center>

    <form method="post">
        {#if editingGroup && !isModalOpen}
            <input type="hidden" name="id" value={editingGroup.id} />
            <input type="text" name="name" placeholder="Name" value={editingGroup.name} required />
            <input type="text" name="description" placeholder="Description" value={editingGroup.description} required />
            <button type="submit" name="action" value="update" class="rounded bg-blue-500 py-1 px-4 text-white font-semibold">
                Update
            </button>
            <button type="button" on:click={cancelEdit} class="rounded bg-red-500 py-1 px-4 text-white font-semibold">
                Cancel
            </button>
        {:else}
            <input type="text" name="name" placeholder="Name" required />
            <input type="text" name="description" placeholder="Description" required />
            <button type="submit" name="action" value="create" class="rounded bg-blue-500 py-1 px-4 text-white font-semibold">
                Submit
            </button>
        {/if}
    </form>

    <br />

    <center>
        <h2>Visos grupės</h2>
    </center>
    <table class="w-full text-left table-auto min-w-max border-collapse border border-gray-400">
        <thead>
            <tr>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">ID</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Pavadinimas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Aprašymas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Veiksmai</th>
            </tr>
        </thead>
        <tbody>
            {#if data.serializedGroups && data.serializedGroups.length > 0}
                {#each data.serializedGroups as group}
                    <tr>
                        <td class="p-4 border-b border-blue-gray-100">{group.id}</td>
                        <td class="p-4 border-b border-blue-gray-100">{group.name}</td>
                        <td class="p-4 border-b border-blue-gray-100">{group.description}</td>
                        <td class="p-4 border-b border-blue-gray-100">
                            <form method="post" style="display:inline;">
                                <input type="hidden" name="id" value={group.id} />
                                <button class="rounded bg-red-500 py-1 px-4 text-white font-semibold" type="submit" name="action" value="delete">
                                    Delete
                                </button>
                            </form>
                            <button 
                                class="rounded bg-purple-500 py-1 px-4 text-white font-semibold" 
                                type="button" 
                                on:click={() => manageGroup(group)}>
                                Manage Group
                            </button>    
                            <button
                                class="rounded bg-yellow-500 py-1 px-4 text-white font-semibold"
                                type="button"
                                on:click={() => {editingGroup = group}}>
                                Edit
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
                    }}
                    class="absolute top-[15px] right-[20px] font-black">
                    <svg class="w-[30px] h-[30px]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h1 class="font-bold text-3xl px-[10px] h-max">Studentų ir dalyko priskyrimas</h1>
                <div class="lg:max-h-[600px] h-max overflow-auto py-[10px] my-[10px]">
                    <form class="h-max px-[10px] py-[10px] rounded-t-[6px] grid grid-cols-2 lg:grid-cols-1 gap-[10px] lg:gap-0" id="form">
                        <label class="font-bold text-xl mb-2 gap-[10px] flex flex-col" for="subject">
                            Dalykas
                            {#await getGroupSubject() then subject}
                                <!-- {@debug subject} -->
                                <select class="shadow appearance-none border rounded grow py-2 px-3 focus:outline-none focus:shadow-outline" id="subject" value={subject || ""}>
                                    <option value="">Pasirinkite dalyką</option>
                                    {#each data.serializedSubjects as subject}
                                        <option value={subject.id}>{subject.name}</option>
                                    {/each}
                                </select>
                            {/await}
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="button" on:click={() => assignSubject()}>Priskirti</button>
                        </label>

                        <hr><br>

                        <label class="font-bold text-xl mb-2 gap-[10px] flex flex-col" for="students">
                            Studentai
                            <select class="shadow appearance-none border rounded grow py-2 px-3 focus:outline-none focus:shadow-outline" id="students">
                                {#each data.serializedStudents as student}
                                    <option value={student.id}>{student.fullname}</option>
                                {/each}
                            </select>
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="button" on:click={() => assignStudent()}>Pridėti prie grupės</button>
                        </label>                                                   
                    </form> 
                    <table class="w-full text-left table-auto min-w-max border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">ID</th>
                                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Studentas</th>
                                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Veiksmai</th>
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
                                                <button class="rounded bg-red-500 py-1 px-4 text-white font-semibold" type="button" on:click={() => removeAssignment(student.id)}>
                                                    Remove
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
                </div>
            </div>
        </div>
    {/if}
    
</main>
