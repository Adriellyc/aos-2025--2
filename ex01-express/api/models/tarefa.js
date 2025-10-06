import { v4 as uuidv4 } from "uuid";

const tarefas = [];

export default class Tarefa {
  constructor(descricao, concluida = false) {
    this.objectId = uuidv4();
    this.descricao = descricao;
    this.concluida = concluida;
  }

  static all() {
    return tarefas;
  }

  static findById(id) {
    return tarefas.find(t => t.objectId === id);
  }

  static create(descricao, concluida) {
    const tarefa = new Tarefa(descricao, concluida);
    tarefas.push(tarefa);
    return tarefa;
  }

  static update(id, data) {
    const tarefa = Tarefa.findById(id);
    if (tarefa) {
      tarefa.descricao = data.descricao ?? tarefa.descricao;
      tarefa.concluida = data.concluida ?? tarefa.concluida;
    }
    return tarefa;
  }

  static delete(id) {
    const index = tarefas.findIndex(t => t.objectId === id);
    if (index !== -1) {
      return tarefas.splice(index, 1)[0];
    }
    return null;
  }
}