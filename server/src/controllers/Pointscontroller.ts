import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response) {
        //cidade, uf, items (Query Params)
        const { city, uf, items } = request.query;

        console.log(city);
        console.log(uf);
        console.log(items);

        const parsedItems = items !== undefined ? String(items).split(',').map(items => Number(items.trim())) : [];

        // const points = await knex('points')
        // .join('point_items', 'points.id', '=', 'point_items.point_id')
        // .whereIn('point_items.item_id', parsedItems)
        // .where('city', 'like', String(city))
        // .where('uf', 'like', String(uf))
        // .distinct()
        // .select('points.*')

        var points;
        parsedItems.length > 0 ?
            points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems)
                .where('city', 'like', String(city))
                .where('uf', 'like', String(uf))
                .distinct()
                .select('points.*')
            :
            points = await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .where('points.city', String(city))
                .where('points.uf', String(uf))
                .distinct()
                .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image: `http://192.168.100.6:3333/uploads/${point.image}`
            }
        });

        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: "Point not found!" })
        }

        /**
         * SELECT * FROM items
         * JOIN point_items ON items.id = point_items.item_id
         * WHERE point_items.point_id = id
         */

        const serializedPoint = {
            ...point,
            image: `http://192.168.100.6:3333/uploads/${point.image}`
        };


        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ serializedPoint, items });
    }

    async create(request: Request, response: Response) {
        const {
            name, //const name = request.body.name
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name, //name: name -> nome da variavel = nome do objeto, pode omitir
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            });

        const pointItemIds = await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point
        });
    }
};

export default PointsController;