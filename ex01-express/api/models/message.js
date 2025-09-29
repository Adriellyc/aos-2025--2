import { DataTypes } from "sequelize";

const getMessageModel = (sequelize, { DataTypes }) => {
  const Message = sequelize.define("Message", { // Convenção: 'Message' com 'M' maiúsculo
    id: { // Adicionando o ID primário, essencial para chaves estrangeiras
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // Opcional, mas útil: Adicionar o campo userId explicitamente
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
  });

  Message.associate = (models) => {
    // CORREÇÃO: Usar belongsTo e definir a foreignKey
    Message.belongsTo(models.User, {
        foreignKey: 'userId', // O nome da coluna na tabela Messages que guarda o ID do User
        as: 'user',        // O alias para quando você incluir o User na busca da Message
    });
  };

  return Message;
};

export default getMessageModel;