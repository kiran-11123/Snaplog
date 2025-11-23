// ...existing code...
import app from '../app.js';
import request from 'supertest';

describe("Data Router API Tests", () => {

  test("GET all workspaces", async () => {
    const res = await request(app)
      .get("/api/v1/workspace/get_data")
      .set('Accept', 'application/json')
      .timeout(10000);

    // allow for unauthenticated envs (401) or success (200)
    expect([200, 401]).toContain(res.status);

    if (res.status === 200) {
      expect(res.headers['content-type']).toMatch(/json/);
      expect(Array.isArray(res.body.data)).toBe(true);
    } else {
      expect(res.body).toHaveProperty('message');
    }
  });

});

describe("Collecting the data for Specific workspace" , ()=>{

    test("Get the data for specific workspace" ,async()=>{
         
        const res = await request(app)
        .post("/api/v1/data/workspace_get_data")
              .send({ workspace_name: "testWorkspace" })

         .set('Accept', 'application/json')
      .timeout(10000);

          expect([200, 401]).toContain(res.status);

          if(res.status===200){
               expect(res.headers['content-type']).toMatch(/json/);
      expect(Array.isArray(res.body.data)).toBe(true);
          }else {
      expect(res.body).toHaveProperty('message');
    }

    })

})