const Url = 'http://localhost:4000';

describe('Проверка доступности приложения', () => {
  beforeEach(() => {
    // Мокируем запросы
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' }).as('login');
    cy.intercept('POST', 'api/auth/token', { fixture: 'login.json' });

    // Устанавливаем токен авторизации
    window.localStorage.setItem('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    
    cy.visit(Url);
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('Добавление булки', () => {
      cy.get('[data-cy=ingredient-bun]').first().contains('Добавить').click();
      cy.get('[data-cy=burger-constructor]').should('contain', 'Фиолетовая булочка');
      cy.get('[data-cy=constructor-bun-top]').should('exist');
      cy.get('[data-cy=constructor-bun-bottom]').should('exist');
    });

     it('Добавление начинки', () => {
      cy.get('[data-cy=ingredient-main]').first().contains('Добавить').click();
      cy.get('[data-cy=burger-constructor]').should('contain', 'Синяя котлета');
      cy.get('[data-cy=constructor-ingredient]').should('exist');
    });

      it('Добавление соуса', () => {
      cy.get('[data-cy=ingredient-sauce]').first().contains('Добавить').click();
      cy.get('[data-cy=burger-constructor]').should('contain', 'Соус голубенький');
      cy.get('[data-cy=constructor-ingredient]').should('exist');
    });
  });

  describe('Проверка модального окна', () => {
    it('Открытие модального окна ингредиента', () => {
      cy.get('[data-cy=ingredient-item]').first().click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=ingredient-details]').should('be.visible');
    });

    describe ('Закрытие модального окна', () => {
      beforeEach(() => {
        cy.get('[data-cy=ingredient-item]').first().click();
        cy.get('[data-cy=modal]').should('be.visible');
      });

      it('Закрытие модального окна по крестику', () => {
        cy.get('[data-cy=modal-close]').click();
        cy.get('[data-cy=modal]').should('not.exist');
      });

      it('Закрытие модального окна через оверлей', () => {
        cy.get('[data-cy=modal-overlay]').click({ force: true });
        cy.get('[data-cy=modal]').should('not.exist');
      });

      it('Закрытие через Escape (альтернативный способ)', () => {
        cy.document().trigger('keydown', { key: 'Escape' });
        cy.get('[data-cy=modal]').should('not.exist');
     });
    });
  });

  describe('Оформление заказа', () => {
    it('Создание заказа с булкой и начинкой', () => {
      // Добавляем ингредиенты
      cy.get('[data-cy=ingredient-bun]').first().contains('Добавить').click();
      cy.get('[data-cy=ingredient-main]').first().contains('Добавить').click();
      // Оформляем заказ
      cy.get('[data-cy=create-order]').contains('Оформить заказ').click();
      // Проверяем модальное окно заказа
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=order-number]').should('contain', '1111');
      // Закрываем модальное окно
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
      cy.url().should('not.include', '/login');
    });

    it('Без булки заказ не создается', () => {
      cy.get('[data-cy=ingredient-main]').first().contains('Добавить').click();
      cy.get('[data-cy=create-order]').contains('Оформить заказ').click();
      cy.get('[data-cy=order-modal]').should('not.exist');
    });

    it('Перенаправление на логин при отсутствии авторизации', () => {
      // Очищаем токены
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      // Мокируем, что пользователь не авторизован
      cy.intercept('GET', 'api/auth/user', {
        statusCode: 401,
        body: { success: false, message: 'Not authorized' }
      }).as('getUserUnauthorized');
      cy.reload();
      cy.wait('@getUserUnauthorized');
      cy.get('[data-cy=ingredient-bun]').first().contains('Добавить').click();
      cy.get('[data-cy=ingredient-main]').first().contains('Добавить').click();
      cy.get('[data-cy=create-order]').contains('Оформить заказ').click();
      cy.url().should('include', '/login');
    });
  });
});