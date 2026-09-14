import {db} from '@/db';
import * as schema from '@/db/schema';
import { sec } from 'better-auth/plugins';

async function main() {
    try{
        await db.delete(schema.students);

        await db.insert(schema.students).values([
            {name:"Thiago", email: "1@gmail.com", address:"123 Avenue", documentCPF:"000.000.000-01", status: 'active'},
            {name:"Anna", email: "2@gmail.com", address:"124 Avenue", documentCPF:"000.000.000-02", status: 'active'},
            {name:"Artur", email: "3@gmail.com", address:"125 Avenue", documentCPF:"000.000.000-03", status: 'active'},
            {name:"Helom", email: "4@gmail.com", address:"126 Avenue", documentCPF:"000.000.000-04", status: 'active'},
        ])
        console.log("Database seeded successfully!");
        
    } catch (error){
        console.error("Seeding failed, error:",error);
    } finally {
        process.exit(0);
    }
}