<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;

    console.log(data);

    let editingUser: any = null;

    function cancelEdit() {
        editingUser = null;
    }
</script>

<main>
    <center>
        <h2>Pridėti naują vartotoją</h2>
    </center>

    <form method="post">
        {#if editingUser}
            <input type="hidden" name="id" value={editingUser.id} />
            <input type="text" name="username" placeholder="Username" value={editingUser.username} required />
            <input type="password" name="password" placeholder="Password" />
            <select name="role" bind:value={editingUser.role} required>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
            </select>
            <input type="text" name="name" placeholder="First Name" value={editingUser.name} required />
            <input type="text" name="surname" placeholder="Last Name" value={editingUser.surname} required />
            <button type="submit" name="action" value="update" class="rounded bg-blue-500 py-1 px-4 text-white font-semibold">
                Update
            </button>
            <button type="button" on:click={cancelEdit} class="rounded bg-red-500 py-1 px-4 text-white font-semibold">
                Cancel
            </button>
        {:else}
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <select name="role" required>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
            </select>
            <input type="text" name="name" placeholder="First Name" required />
            <input type="text" name="surname" placeholder="Last Name" required />
            <button type="submit" name="action" value="create" class="rounded bg-blue-500 py-1 px-4 text-white font-semibold">
                Submit
            </button>
        {/if}
    </form>

    <br />

    <center>
        <h2>Visi vartotojai</h2>
    </center>
    <table class="w-full text-left table-auto min-w-max border-collapse border border-gray-400">
        <thead>
            <tr>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">ID</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Vartotojo vardas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Pareigos</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Vardas</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Pavardė</th>
                <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">Veiksmai</th>
            </tr>
        </thead>
        <tbody>
            {#if data.serializedUsers && data.serializedUsers.length > 0}
                {#each data.serializedUsers as user}
                    <tr>
                        <td class="p-4 border-b border-blue-gray-100">{user.id}</td>
                        <td class="p-4 border-b border-blue-gray-100">{user.username}</td>
                        <td class="p-4 border-b border-blue-gray-100">{user.role}</td>
                        <td class="p-4 border-b border-blue-gray-100">{user.name}</td>
                        <td class="p-4 border-b border-blue-gray-100">{user.surname}</td>
                        <td class="p-4 border-b border-blue-gray-100">
                            <form method="post" style="display:inline;">
                                <input type="hidden" name="id" value={user.id} />
                                <button class="rounded bg-red-500 py-1 px-4 text-white font-semibold" type="submit" name="action" value="delete">
                                    Delete
                                </button>
                            </form>
                            <button
                                class="rounded bg-yellow-500 py-1 px-4 text-white font-semibold"
                                type="button"
                                on:click={() => {editingUser = user}}>
                                Edit
                            </button>
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr>
                    <td class="p-4 text-center" colspan="6">No users found</td>
                </tr>
            {/if}
        </tbody>
        
    </table>
</main>
