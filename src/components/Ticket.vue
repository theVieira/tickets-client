<template>
	<div class="container">
		<div class="ticket-container" @click="showTicketInfos" :class="progressBorder">
			<section class="info-section">
				<h4>Cliente</h4>
				<p>{{ ticket.clientName.toUpperCase() }}</p>
				<p style="font-size: 1.5rem">{{ FormatDate(ticket.createdAt) }}</p>
			</section>
			<section class="info-section large">
				<h4>Descrição</h4>
				<p v-show="!editShow">{{ ticket.description }}</p>
				<textarea
					placeholder="Insira a nova descrição"
					type="text"
					name="editDescription"
					id="editDescription"
					v-show="editShow"
					v-model="description"
					class="edit textarea"
				/>
			</section>
			<section class="info-section">
				<h4>Prioridade</h4>
				<p :class="priority" class="priority">
					{{ Translate(ticket.priority).toUpperCase() }}
				</p>
			</section>

			<section class="info-section">
				<h4>Status</h4>
				<p :class="status" class="status">
					{{ Translate(ticket.status).toUpperCase() }}
				</p>
			</section>
		</div>
		<div class="ticket-actions" v-show="ticketFocus">
			<div class="more-infos">
				<section class="more-info">
					<h4>Categoria</h4>
					<p class="category" v-show="!editShow">
						{{ Translate(ticket.category).toUpperCase() }}
					</p>
					<select
						name="edit"
						id="editCategory"
						v-show="editShow"
						v-model="category"
						class="edit"
					>
						<option value="" selected disabled>Selectione</option>
						<option value="daily">Diário</option>
						<option value="delivery">Entrega</option>
						<option value="budget">Orçamento</option>
					</select>
				</section>
				<section class="more-info" v-if="ticket.reccurrent">
					<h4>Recorrente</h4>
					<img
						src="../assets/icons/check.png"
						alt="check icon"
						class="checkReccurrent"
					/>
				</section>
				<section class="more-info">
					<h4>Criado</h4>
					<p>{{ FormatDate(ticket.createdAt) }}</p>
				</section>

				<section class="more-info" v-if="ticket.status != 'open'">
					<h4>Progresso</h4>
					<p>{{ FormatDate(ticket.progress) }}</p>
				</section>
				<section class="more-info" v-if="ticket.status == 'finished'">
					<h4>Finalizado:</h4>
					<p>{{ FormatDate(ticket.finished) }}</p>
				</section>
				<section class="more-info" v-if="ticket.techName">
					<h4>Técnico</h4>
					<section :style="{ color: ticket.techColor }">
						{{ ticket.techName.toUpperCase() }}
					</section>
				</section>
				<section class="more-info" v-if="ticket.report">
					<h4>Feedback do técnico</h4>
					<p style="white-space: pre-wrap; word-break: break-word">
						{{ ticket.report }}
					</p>
				</section>
				<section class="note" v-if="ticket.note">
					<h4 style="color: #ffffff">Anotação</h4>
					<p style="white-space: pre-wrap; word-break: break-word">
						{{ ticket.note }}
					</p>
				</section>
				<div class="actions">
					<div
						class="action"
						v-if="admin == 'true' && !editShow"
						@click="showEdit"
						@mouseover="showActionsLabel(0)"
						@mouseout="showActionsLabel(0)"
					>
						<p v-show="actionsLabel[0]">Editar</p>
						<img src="../assets/icons/pencil.png" alt="pencil icon" />
					</div>
					<div class="editActions" v-if="admin == 'true'" v-show="editShow">
						<div
							class="action"
							@click="saveEdited(ticket.id)"
							@mouseover="showActionsLabel(1)"
							@mouseout="showActionsLabel(1)"
						>
							<p v-show="actionsLabel[1]">Salvar</p>
							<img src="../assets/icons/save.png" alt="save icon" />
						</div>
						<div
							class="action"
							v-show="editShow"
							@click="editShow = false"
							@mouseover="showActionsLabel(2)"
							@mouseout="showActionsLabel(2)"
						>
							<p v-show="actionsLabel[2]">Cancelar</p>
							<img
								src="../assets/icons/block.svg"
								alt="cancel icon"
								style="width: 3.2rem"
							/>
						</div>
					</div>
					<div
						class="action"
						v-if="admin == 'true' || delete_ticket == 'true'"
						@click.prevent="deleteTicket(ticket)"
						@mouseover="showActionsLabel(3)"
						@mouseout="showActionsLabel(3)"
					>
						<p v-show="actionsLabel[3]">Deletar</p>
						<img src="../assets/icons/trash.png" alt="trash icon" />
					</div>
					<div
						class="action"
						v-if="ticket.status == 'progress'"
						@click="setFinishedTicket(ticket.id)"
						@mouseover="showActionsLabel(4)"
						@mouseout="showActionsLabel(4)"
					>
						<p v-show="actionsLabel[4]">Finalizar</p>
						<img src="../assets/icons/check.png" alt="check icon" />
					</div>
					<div
						class="action"
						v-if="ticket.status == 'finished'"
						@click="reopen(ticket.id)"
						@mouseover="showActionsLabel(5)"
						@mouseout="showActionsLabel(5)"
					>
						<p v-show="actionsLabel[5]">Reabrir</p>
						<img src="../assets/icons/reload.png" alt="reload icon" />
					</div>
					<div
						class="action"
						v-if="ticket.status == 'open'"
						@click.prevent="setProgressTicket(ticket.id)"
						@mouseover="showActionsLabel(5)"
						@mouseout="showActionsLabel(5)"
					>
						<p v-show="actionsLabel[5]">Progresso</p>
						<img
							src="../assets/icons/progress.png"
							alt="progress icon"
							style="width: 4rem"
						/>
					</div>
					<div
						class="action"
						@click.prevent="addNote(ticket.id)"
						@mouseover="showActionsLabel(6)"
						@mouseout="showActionsLabel(6)"
					>
						<p v-show="actionsLabel[6]">Anotar</p>
						<img src="../assets/icons/note.png" alt="note icon" />
					</div>
					<div
						class="action"
						v-if="admin"
						@click="msgShow = true"
						@mouseover="showActionsLabel(7)"
						@mouseout="showActionsLabel(7)"
					>
						<p v-show="actionsLabel[7]">Mensagem</p>
						<img src="../assets/icons/whatsapp.png" alt="whats icon" />
					</div>
				</div>
			</div>

			<div class="message" v-if="msgShow">
				<p id="close" @click="msgShow = false">X</p>
				<select class="selectTech" v-model="phone">
					<option value="" disabled selected>Selecione</option>
					<option v-for="tech in techs" :key="tech.id" :value="tech.phone">
						{{ tech.name }} | {{ tech.phone }}
					</option>
				</select>
				<a rel="noopener noreferrer" class="msgLink" @click="sendMsg">Enviar</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { baseUrl } from '../../conf'
import { Translate } from '@/assets/utils/Translate'
import { FormatDate } from '@/assets/utils/FormatDate'
import { InitializeVars } from '@/assets/utils/InitializeVars'

const { token, admin, delete_ticket, techName, msg } = InitializeVars()

const actionsLabel = ref([false, false, false, false, false, false, false, false])

function showEdit() {
	editShow.value = true
	actionsLabel.value[0] = false
}

function showActionsLabel(index) {
	actionsLabel.value[index] = !actionsLabel.value[index]
}

const props = defineProps({
	ticket: {},
	techs: {
		type: Array,
		default: () => [],
	},
})

const msgShow = ref(false)
const phone = ref('')

msg.value = `Chamado%0ACliente%3A%20${
	props.ticket.clientName
}%2C%0ADescri%C3%A7%C3%A3o%3A%20${
	props.ticket.description
}%2C%0APrioridade%3A%20${Translate(
	props.ticket.priority
)}%2C%0AStatus%3A%20${Translate(props.ticket.status)}`

function sendMsg() {
	const url = `https://wa.me/55${phone.value}?text=${msg.value}`
	window.open(url, '_blank')
}

const ticketFocus = ref(false)
const editShow = ref(false)
const category = ref(props.ticket.category)
const description = ref(props.ticket.description)

addEventListener('keydown', (ev) => {
	if (ticketFocus.value == true && ev.key == 'Escape') {
		ticketFocus.value = false
		emit('focus', { data: ticketFocus.value })
	}
})

const emit = defineEmits([
	'deleted',
	'progress',
	'finished',
	'reopen',
	'edited',
	'noted',
	'focus',
])

const progressBorder = computed(() => {
	if (props.ticket.status == 'progress') {
		return 'progressBorder'
	}
})

const priority = computed(() => {
	switch (props.ticket.priority) {
		case 'urgent':
			return 'urgent-priority'
		case 'high':
			return 'high-priority'
		case 'medium':
			return 'medium-priority'
		case 'low':
			return 'low-priority'
	}
})

const status = computed(() => {
	switch (props.ticket.status) {
		case 'open':
			return 'open-status'
		case 'progress':
			return 'progress-status'
		case 'finished':
			return 'finished-status'
	}
})

function showTicketInfos() {
	if (editShow.value) {
		ticketFocus.value = true
	} else {
		ticketFocus.value = !ticketFocus.value
		emit('focus', { data: ticketFocus.value })
	}
}

async function deleteTicket(ticket) {
	const confirmation = confirm(
		`Deseja realmente deletar este chamado?\n\nCliente: ${
			ticket.clientName
		}\nDescrição: ${ticket.description}\nPrioridade: ${Translate(ticket.priority)}`
	)
	if (confirmation == true) {
		const res = await fetch(baseUrl + '/ticket/delete', {
			method: 'DELETE',
			headers: {
				authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: ticket.id,
			}),
		})

		const data = await res.json()

		if (res.status != 200) {
			console.error(data)
		}

		emit('deleted', { id: ticket.id, status: res.status })
	}
}

async function setProgressTicket(id) {
	const res = await fetch(baseUrl + '/ticket/progress', {
		method: 'PUT',
		headers: {
			authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id,
			techName,
		}),
	})

	const data = await res.json()

	if (res.status != 200) {
		console.error(data)
	}

	emit('progress', { id, status: res.status })
}

async function setFinishedTicket(id) {
	const report = prompt('Insira o feedback do chamado')
	if (report && report.length < 559) {
		const res = await fetch(baseUrl + '/ticket/finished', {
			method: 'PUT',
			headers: {
				authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id,
				techName,
				report,
			}),
		})

		const data = await res.json()

		if (res.status != 200) {
			console.error(data)
		}

		emit('finished', { id, status: res.status })
	} else {
		alert('Limite de caracteres excedido!')
		throw new Error('feedback char over limit')
	}
}

async function reopen(id) {
	const res = await fetch(baseUrl + '/ticket/reopen', {
		method: 'PUT',
		headers: {
			authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id,
		}),
	})

	const data = await res.json()

	if (res.status != 200) {
		console.error(data)
	}

	emit('reopen', { id, status: res.status })
}

async function saveEdited(id) {
	const confirmation = confirm(
		`Deseja salvar estas informações?\nDescrição: ${
			description.value
		}\nCategoria: ${Translate(category.value)}`
	)
	if (confirmation) {
		if (description.value.length > 599) {
			alert('Limite de caracteres excedido!')
			throw new Error('description char over limit')
		} else {
			const res = await fetch(baseUrl + '/ticket/edit', {
				method: 'PUT',
				headers: {
					authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id,
					description: description.value,
					category: category.value,
				}),
			})

			const data = await res.json()

			if (res.status != 200) {
				console.error(data)
			}

			editShow.value = false
			emit('edited', { id, status: res.status, data })
		}
		actionsLabel.value[0] = false
	}
}

async function addNote(id) {
	const note = prompt('Insira a anotação')
	if (note) {
		if (note.length > 599) {
			alert('Limite de caracteres excedido!')
			throw new Error('note char over limit')
		} else {
			const res = await fetch(baseUrl + '/ticket/addNote', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					id,
					note,
					techName,
				}),
			})

			const data = await res.json()

			if (res.status != 200) {
				console.error(data)
			}

			emit('noted', { id, status: res.status, data })
		}
	}
}
</script>

<style scoped>
.container {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 1rem;
	position: relative;
}

.ticket-container {
	width: 100%;
	display: flex;
	align-items: self-start;
	justify-content: center;
	background: var(--dark-background);
	box-shadow: inset 0 0 0.2rem white;
	padding: 1rem 3rem;
	border-radius: 1.2rem;
	flex-wrap: wrap;
	gap: 3rem;
	cursor: pointer;
}

.info-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	flex-basis: 10rem;
	flex-shrink: 0;
	flex-grow: 1;
}

.info-section h4 {
	color: #f1f1f1;
}

.info-section p {
	text-align: center;
	word-break: break-word;
}

.ticket-actions {
	margin-top: -1rem;
	width: 100%;
	background: var(--light-background);
	padding: 3rem;
	border-radius: 1.2rem;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-around;
	gap: 1.5rem;
	box-shadow: inset 0 0 0.2rem white;
}

.ticket-actions .actions {
	margin-top: 3rem;
	width: 100%;
	display: flex;
	gap: 2.4rem;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.ticket-actions .more-infos {
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	gap: 1.5rem;
	text-align: center;
	width: 90%;
}

.note {
	display: flex;
	flex-direction: column;
	text-align: start;
	width: 81%;
}

.ticket-actions .action {
	cursor: pointer;
	height: 3.2rem;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	gap: 1rem;
	font-weight: 600;
	flex-wrap: wrap;
	justify-content: center;
	position: relative;
	opacity: 0.7;
	transition: all 0.3s;
}

.ticket-actions .action:hover {
	opacity: 1;
	filter: brightness(110%);
}

.action p {
	top: -100%;
	position: absolute;
}

.editActions {
	display: flex;
	gap: 2.2rem;
	justify-content: center;
	align-items: center;
}

.more-info {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	align-items: center;
}

.more-info h4 {
	white-space: nowrap;
	color: #f1f1f1;
}

.more-info p {
	word-break: break-all;
	text-align: start;
}

.status {
	padding: 0.3rem 0.7rem;
	border-radius: 1.2rem;
	word-break: break-word;
}

.priority {
	padding: 0.3rem 0.7rem;
	border-radius: 1.2rem;
	word-break: break-word;
}

.checkReccurrent {
	width: 2.5rem;
}

.edit {
	padding: 1rem 2rem;
	border-radius: 1.2rem;
	border: none;
	background: var(--medium-background);
	color: var(--light-color);
	font-weight: 600;
	cursor: pointer;
	transition: 0.3s;
}

.textarea {
	height: 10rem;
}

.message {
	height: 12rem;
	padding: 2rem;
	background: var(--dark-background);
	border-radius: 1.2rem;
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	gap: 1.6rem;
}

#close {
	font-weight: 800;
	font-size: 2rem;
	position: absolute;
	top: 1rem;
	right: 1rem;
	color: #c25005;
	cursor: pointer;
}

.msgLink {
	color: #cecece;
	background: rgba(53, 167, 53, 0.589);
	padding: 1rem 2rem;
	border-radius: 1.2rem;
	cursor: pointer;
}

.selectTech {
	background: var(--light-background);
	color: var(--light-color);
	padding: 1rem 2rem;
	border-radius: 1.2rem;
}

.progressBorder {
	border: 1px solid #d89b3f94;
	box-shadow: inset 0 0 0.2rem #d89b3f94;
}

@media (max-width: 900px) {
	.ticket-container {
		padding: 3rem;
	}

	.more-infos {
		width: 100% !important;
	}

	.actions {
		justify-content: center !important;
		margin-top: 1rem;
	}

	.message {
		height: 15rem;
	}
}
</style>
