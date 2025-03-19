<template>
	<div class="filter">
		<div class="filter-input">
			<input
				type="text"
				name="find"
				id="find"
				class="search"
				placeholder="Buscar por cliente"
				v-model="clientName"
			/>
		</div>
		<div class="date-input">
			<input
				type="date"
				id="from-date"
				class="date-option"
				v-model="dateFrom"
			/>
			<span>até</span>
			<input type="date" id="to-date" class="date-option" v-model="dateTo" />
		</div>
		<div class="filter-input">
			<select name="order" id="order" v-model="order" class="search">
				<option value="all" selected>Todos</option>
				<option value="daily">Diários</option>
				<option value="delivery">Entregas</option>
				<option value="budget">Orçamentos</option>
			</select>
			<input
				type="button"
				value="Buscar"
				class="search"
				@click.prevent="search"
			/>
		</div>
	</div>
</template>

<script setup>
import { FetchAPI } from '@/assets/utils/FetchAPI'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { ref } from 'vue'

const { order, clientName, token } = InitializeVars()

const dateFrom = ref()
const dateTo = ref()

const emit = defineEmits(['search'])

const props = defineProps({
	url: String,
})

addEventListener('keydown', (ev) => {
	if (ev.key == 'Enter') {
		search()
	}
})

async function search() {
	const res = await FetchAPI(`/ticket/list${props.url}/${order.value}`, token)

	const filterByName = res.filter((ticket) =>
		ticket.clientName.toLowerCase().includes(clientName.value.toLowerCase())
	)

	const data = filterByName.filter((ticket) =>
		filterByDate(ticket, dateFrom.value, dateTo.value)
	)

	emit('search', { data })
}

function filterByDate(ticket, dateFrom, dateTo) {
	const parseISO = (date) => new Date(date)

	if (!dateFrom && !dateTo) return true

	const ticketDate = parseISO(ticket.createdAt)
	const startDate = dateFrom ? parseISO(dateFrom) : null
	const endDate = dateTo ? parseISO(dateTo) : new Date()

	if (startDate && endDate) {
		return ticketDate >= startDate && ticketDate <= endDate
	} else if (startDate) {
		return ticketDate >= startDate
	}

	return true
}
</script>

<style scoped>
.filter {
	display: flex;
	flex-wrap: wrap;
}

.filter .filter-input {
	display: flex;
	gap: 2rem;
	height: 4rem;
}

.filter .search {
	padding: 0 2rem;
	border-radius: 1.2rem;
	border: none;
	box-shadow: inset 0 0 0.2rem white;
	background: var(--dark-background);
	color: var(--light-color);
	font-weight: 600;
	cursor: pointer;
	transition: 0.3s;
}

.filter .search:hover {
	filter: brightness(120%);
}

select {
	background: var(--dark-background);
	border: none;
	border-radius: 1.2rem;
	padding: 1rem 2rem;
	color: var(--light-color);
	font-weight: 600;
}

.date-input {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin: 0 2rem;
}

.date-option {
	padding: 1rem 2rem;
	border-radius: 1.2rem;
	background: transparent;
	color: var(--light-color);
	border: none;
	box-shadow: inset 0 0 0.2rem white;
}

@media (max-width: 900px) {
	.filter {
		gap: 1rem;
	}

	.filter .filter-input {
		gap: 1rem;
	}
}
</style>
