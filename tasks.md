# 🛠️ Decouple Password Handler (Dependency Injection)

## Phase 1: Define Contracts & Implementation

- [ ] **1. Define the `PasswordUtility` Interface**
  - File: `src/types/user_type.ts` (or `app_dependency_type.ts`)
  - [ ] Add the interface defining the contract:
    ```typescript
    export interface PasswordUtility {
      hash(password: string): string | Promise<string>;
      compare(password: string, hash: string): boolean | Promise<boolean>;
    }
    ```

- [ ] **2. Create the Concrete Implementation**
  - File: `src/utils/password_utility.ts` (new file)
  - [ ] Import `bcrypt`.
  - [ ] Implement the factory function returning the interface:

    ```typescript
    import bcrypt from "bcrypt";
    import { PasswordUtility } from "../types/user_type.js";

    export const createBcryptPasswordUtility = (): PasswordUtility => ({
      hash: (password: string) => bcrypt.hashSync(password, 2),
      compare: (password: string, hash: string) =>
        bcrypt.compareSync(password, hash),
    });
    ```

## Phase 2: Refactor Business Services

- [ ] **3. Update `RegisterService`**
  - File: `src/service/register_service.ts`
  - [ ] Remove `import bcrypt from "bcrypt"`.
  - [ ] Update `createRegisterService` parameters to accept `passwordUtility: PasswordUtility`.
  - [ ] Replace `bcrypt.hashSync(...)` with `passwordUtility.hash(...)`.

- [ ] **4. Update `LoginService`**
  - File: `src/service/login_service.ts`
  - [ ] Remove `import bcrypt from "bcrypt"`.
  - [ ] Update `createLoginService` parameters to accept `passwordUtility: PasswordUtility` alongside `userRepo` and `secret`.
  - [ ] Replace `bcrypt.compareSync(...)` with `passwordUtility.compare(...)`.

## Phase 3: Wire Up Dependencies

- [ ] **5. Inject the Utility in the Entry Point**
  - File: `src/index.ts`
  - [ ] Import `createBcryptPasswordUtility`.
  - [ ] Instantiate the utility: `const passwordUtility = createBcryptPasswordUtility();`
  - [ ] Pass `passwordUtility` into `createLoginService(...)` and `createRegisterService(...)`.
  - _(Note: `createApp.ts` and `AppDependencies` require zero changes since they only care about the fully constructed services!)_

## Phase 4: Fix Unit Tests

- [ ] **6. Update Register Service Tests**
  - File: `test/service/register_service.test.ts`
  - [ ] Create a mock `PasswordUtility` in `beforeEach` (e.g., returning plain text or a fixed string).
  - [ ] Pass the mock to `createRegisterService`.

- [ ] **7. Update Login Service Tests**
  - File: `test/service/login_service.test.ts`
  - [ ] Create a mock `PasswordUtility` in `beforeEach`.
  - [ ] Pass the mock to `createLoginService`.

- [ ] **8. Update Main App Acceptance Tests**
  - File: `test/main/app.test.ts`
  - [ ] Update the initialization of `createLoginService` and `createRegisterService` in the `beforeAll` block to include a mock `PasswordUtility` (or use the real `createBcryptPasswordUtility` to test the full flow).
