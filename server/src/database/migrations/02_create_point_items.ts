import Knex from 'knex';

export async function up(knex: Knex) {
    //Criar a tabela
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();
        table.integer('point_id').references('id').inTable('points')
            .notNullable();
        table.integer('item_id').references('id').inTable('items')
            .notNullable();
    });
}

export async function down(knex: Knex) {
    // Deletar a tabela
    return knex.schema.dropTable('point_items');
}