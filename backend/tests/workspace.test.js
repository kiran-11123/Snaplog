
import app from '../app.js';
import request from 'supertest';


describe("Data Router API Tests" , ()=>{
        
    test("GET all workspaces " , async()=>{
         const res = await request(app).get("/api/v1/workspace/get_data");

         expect(res.status).toBe(200);
         expect(Array.isArray(res.body.data)).toBe(true);
    })
})