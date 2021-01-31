<template>
  <v-card>
    <v-container fluid>
      <v-form ref="form" v-model="valid">
        <v-row
          align="center"
        >
          <v-col cols="12">
            <h1>{{ type === 1 ? 'Atualizar Dívida' : 'Nova Dívida' }}</h1>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="selected.userName"
              :disabled="sending"
              :items="items"
              :rules="[!!selected.userName || 'É necessário informar o cliente.']"
              item-text="name"
              item-value="name"
              label="Clientes"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
          <v-text-field
              v-model="selected.cause"
              :disabled="sending"
              :rules="[!!selected.cause || 'É necessário informar o motivo.']"
              :counter="60"
              label="Motivo"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="selected.value"
              :disabled="sending"
              :rules="[!!selected.value || 'É necessário informar o valor.']"
              :counter="12"
              label="Valor"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="selected.date"
                  :disabled="sending"
                  :rules="[!!selected.date || 'É necessário informar a data.']"
                  label="Data da dívida"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="selected.date"
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-dialog
              v-if="type === 1"
              v-model="dialog"
              persistent
              max-width="360"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  depressed
                  :disabled="sending"
                  color="error"
                  class="mr-3"
                  v-bind="attrs"
                  v-on="on"
                >
                  Deletar
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Tem certeza que deseja deletar esta dívida?
                </v-card-title>
                <v-card-text>Uma vez feita essa ação não haverá mais como reverter.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn
                      color="error darken-1"
                      text
                      @click="dialog = false"
                    >
                      cancelar
                    </v-btn>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="remove"
                    >
                      confirmar
                    </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn
              depressed
              :disabled="sending"
              @click="submit"
              color="primary"
            >
              Salvar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    props: {
      selected: Object,
      type: Number
    },
    data: () => ({
      dialog: false,
      valid: false,
      sending: false,
      menu: false,
      items: ['Pedro', 'Maria', 'João'],
    }),
    mounted () {
      this.$instanceUsersAPI
        .listAll()
        .then(response => {
          this.items = response.data
        })
    },
    methods: {
      save (date) {
        this.$refs.menu.save(date)
      },
      submit () {
        if (!this.valid) {
          this.$refs.form.validate()
          return
        }
        this.sending = true
        const data = {
          userID: this.selected.userID,
          userName: this.selected.userName,
          cause: this.selected.cause,
          value: this.selected.value,
          date: this.selected.date
        }
        if (this.selected.formType === 1) {
          this.$instanceDebtsAPI.update(this.selected._id, data)
          .then(() =>{
            this.$emit('update', { _id: this.selected._id, ...data })
            this.$refs.form.resetValidation()
            this.sending = false
          })
        } else {
          data.userID = this.items.find(client => client.name === this.selected.userName)?.id
          this.$instanceDebtsAPI.create(data)
          .then(resp => { 
            this.$emit('add', resp.data)
            this.$refs.form.resetValidation()
            this.sending = false
          })
        }
      },
      remove () {
        this.sending = true
        this.dialog = false
        this.$instanceDebtsAPI
          .delete(this.selected._id)
          .then(() => {
            this.$emit('del', this.selected._id)
            this.sending = false
          })
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
  }
</script>
