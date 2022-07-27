describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Riko Saarinen',
      username: 'riksa1',
      password: 'salainen',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Login to application')
    cy.contains('login')
    cy.get('#Username')
    cy.get('#Password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#Username').type('riksa1')
      cy.get('#Password').type('salainen')
      cy.get('#Login').click()

      cy.contains('logout')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#Username').type('riksa2')
      cy.get('#Password').type('wrong')
      cy.get('#Login').click()

      cy.contains('invalid username or password').and(
        'have.css',
        'color',
        'rgb(255, 0, 0)'
      )
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('login').click()
      cy.get('#Username').type('riksa1')
      cy.get('#Password').type('salainen')
      cy.get('#Login').click()
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.contains('create new').click()
        cy.get('#Author').type('New Author')
        cy.get('#Title').type('New Title')
        cy.get('#Url').type('New Url')
        cy.get('#Newblogbutton').click()
        cy.contains('New Title New Author')
      })

      it('it can be liked', function () {
        cy.contains('New Title New Author').contains('view').click()

        cy.contains('likes 0').contains('like').click()

        cy.contains('likes 1')
      })

      it('it can be removed by user', function () {
        cy.contains('New Title New Author').contains('view').click()
        cy.contains('remove').click()
        cy.contains('likes 0').should('not.exist')
      })

      it('it cant be removed by different user', function () {
        const user2 = {
          name: 'Riko Saarinen2',
          username: 'riksa2',
          password: 'salainen2',
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
        cy.contains('logout').click()
        cy.get('#Username').type('riksa2')
        cy.get('#Password').type('salainen2')
        cy.get('#Login').click()
        cy.contains('New Title New Author').contains('view').click()
        cy.contains('remove').should('not.exist')
      })

      it('it can be sorted based on likes', function () {
        cy.get('#Author').type('New Author2')
        cy.get('#Title').type('New Title2')
        cy.get('#Url').type('New Url2')
        cy.get('#Newblogbutton').click()
        cy.contains('New Title2 New Author2')
        cy.contains('New Title2 New Author2').contains('view').click()
        cy.contains('likes 0').contains('like').click()
        cy.contains('likes 1')
        cy.contains('New Title New Author').contains('view').click()
        cy.get('.blog').eq(0).should('contain', 'New Title2')
        cy.get('.blog').eq(1).should('contain', 'New Title')
      })
    })
  })
})
