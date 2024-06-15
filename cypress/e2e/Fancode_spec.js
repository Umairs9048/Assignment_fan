
describe('FanCode City Users Todos Completion Test', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';  
  it('Should verify that all users in FanCode city have more than 50% of their todos completed', () => {
    // Fetch all users
    cy.request(`${BASE_URL}/users`).then((response) => {
      expect(response.status).to.eq(200);
      const users = response.body;

      users.forEach((user) => {
        const lat = parseFloat(user.address.geo.lat);
        const lng = parseFloat(user.address.geo.lng);

        // Checking if the user is in FanCode city range
        if (lat > -40 && lat < 5 && lng > 5 && lng < 100) {
          const userId = user.id;

          // Fetch todos for the user in city range
          cy.request(`${BASE_URL}/todos?userId=${userId}`).then((todoResponse) => {
            expect(todoResponse.status).to.eq(200);
            const todos = todoResponse.body;

            const totalTodos = todos.length;
            const completedTodos = todos.filter(todo => todo.completed).length;
            const completionPercentage = Math.floor((completedTodos / totalTodos) * 100);
            // Assert that the completion percentage is greater than 50%
            expect(completionPercentage).to.be.greaterThan(50, `User ${user.name} (ID: ${userId}) has only ${completionPercentage}% tasks completed`);
          });
        }
      });
    });
  });
});
