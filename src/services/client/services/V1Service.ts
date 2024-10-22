/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AreaGeo } from '../models/AreaGeo';
import type { CancelSignalReporter } from '../models/CancelSignalReporter';
import type { Category } from '../models/Category';
import type { EmailPreview } from '../models/EmailPreview';
import type { EmailPreviewPost } from '../models/EmailPreviewPost';
import type { EmailVerification } from '../models/EmailVerification';
import type { Expression } from '../models/Expression';
import type { Feedback } from '../models/Feedback';
import type { HistoryLogHal } from '../models/HistoryLogHal';
import type { MySignalsLoggedInReporter } from '../models/MySignalsLoggedInReporter';
import type { MySignalsToken } from '../models/MySignalsToken';
import type { PaginatedAbridgedChildSignalList } from '../models/PaginatedAbridgedChildSignalList';
import type { PaginatedAreaList } from '../models/PaginatedAreaList';
import type { PaginatedCategoryList } from '../models/PaginatedCategoryList';
import type { PaginatedExpressionList } from '../models/PaginatedExpressionList';
import type { PaginatedPermissionList } from '../models/PaginatedPermissionList';
import type { PaginatedPrivateCategoryList } from '../models/PaginatedPrivateCategoryList';
import type { PaginatedPrivateDepartmentSerializerListList } from '../models/PaginatedPrivateDepartmentSerializerListList';
import type { PaginatedPrivateSignalAttachmentList } from '../models/PaginatedPrivateSignalAttachmentList';
import type { PaginatedPrivateSignalSerializerListList } from '../models/PaginatedPrivateSignalSerializerListList';
import type { PaginatedPublicQuestionSerializerDetailList } from '../models/PaginatedPublicQuestionSerializerDetailList';
import type { PaginatedRoleList } from '../models/PaginatedRoleList';
import type { PaginatedSignalContextReporterList } from '../models/PaginatedSignalContextReporterList';
import type { PaginatedSignalIdListList } from '../models/PaginatedSignalIdListList';
import type { PaginatedSignalListList } from '../models/PaginatedSignalListList';
import type { PaginatedSignalReporterList } from '../models/PaginatedSignalReporterList';
import type { PaginatedSourceList } from '../models/PaginatedSourceList';
import type { PaginatedStandardAnswerList } from '../models/PaginatedStandardAnswerList';
import type { PaginatedStatusMessageList } from '../models/PaginatedStatusMessageList';
import type { PaginatedStoredSignalFilterList } from '../models/PaginatedStoredSignalFilterList';
import type { PaginatedUserListHALList } from '../models/PaginatedUserListHALList';
import type { PaginatedUserNameListList } from '../models/PaginatedUserNameListList';
import type { PatchedExpression } from '../models/PatchedExpression';
import type { PatchedFeedback } from '../models/PatchedFeedback';
import type { PatchedPrivateCategory } from '../models/PatchedPrivateCategory';
import type { PatchedPrivateCategoryIcon } from '../models/PatchedPrivateCategoryIcon';
import type { PatchedPrivateDepartmentSerializerList } from '../models/PatchedPrivateDepartmentSerializerList';
import type { PatchedPrivateSignalAttachmentUpdate } from '../models/PatchedPrivateSignalAttachmentUpdate';
import type { PatchedPrivateSignalSerializerList } from '../models/PatchedPrivateSignalSerializerList';
import type { PatchedRole } from '../models/PatchedRole';
import type { PatchedStatusMessage } from '../models/PatchedStatusMessage';
import type { PatchedStoredSignalFilter } from '../models/PatchedStoredSignalFilter';
import type { PatchedUserDetailHAL } from '../models/PatchedUserDetailHAL';
import type { Permission } from '../models/Permission';
import type { PrivateCategory } from '../models/PrivateCategory';
import type { PrivateCategoryHistoryHal } from '../models/PrivateCategoryHistoryHal';
import type { PrivateCategoryIcon } from '../models/PrivateCategoryIcon';
import type { PrivateDepartmentSerializerDetail } from '../models/PrivateDepartmentSerializerDetail';
import type { PrivateDepartmentSerializerList } from '../models/PrivateDepartmentSerializerList';
import type { PrivateSignalAttachment } from '../models/PrivateSignalAttachment';
import type { PrivateSignalAttachmentUpdate } from '../models/PrivateSignalAttachmentUpdate';
import type { PrivateSignalSerializerDetail } from '../models/PrivateSignalSerializerDetail';
import type { PrivateSignalSerializerList } from '../models/PrivateSignalSerializerList';
import type { PrivateUserHistoryHal } from '../models/PrivateUserHistoryHal';
import type { PublicSignalAttachment } from '../models/PublicSignalAttachment';
import type { PublicSignalCreate } from '../models/PublicSignalCreate';
import type { PublicSignalSerializerDetail } from '../models/PublicSignalSerializerDetail';
import type { ReportSignalsPerCategory } from '../models/ReportSignalsPerCategory';
import type { Role } from '../models/Role';
import type { SignalContext } from '../models/SignalContext';
import type { SignalDetail } from '../models/SignalDetail';
import type { SignalReporter } from '../models/SignalReporter';
import type { Source } from '../models/Source';
import type { StateStatusMessageTemplate } from '../models/StateStatusMessageTemplate';
import type { StatusMessage } from '../models/StatusMessage';
import type { StatusMessageCategoryPosition } from '../models/StatusMessageCategoryPosition';
import type { StatusMessageList } from '../models/StatusMessageList';
import type { StoredSignalFilter } from '../models/StoredSignalFilter';
import type { UserDetailHAL } from '../models/UserDetailHAL';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class V1Service {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * List all Signals, created in the past year, for the currently logged in Reporter
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param status Melding status
     *
     * * `open` - Open
     * * `closed` - Closed
     * @returns PaginatedSignalListList
     * @throws ApiError
     */
    public v1MySignalsList(
        ordering?: string,
        page?: number,
        pageSize?: number,
        status?: 'closed' | 'open',
    ): CancelablePromise<PaginatedSignalListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/my/signals/',
            query: {
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'status': status,
            },
        });
    }

    /**
     * Retrieve a Signal for the currently logged in Reporter
     * @param uuid
     * @returns SignalDetail
     * @throws ApiError
     */
    public v1MySignalsRetrieve(
        uuid: string,
    ): CancelablePromise<SignalDetail> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/my/signals/{uuid}/',
            path: {
                'uuid': uuid,
            },
        });
    }

    /**
     * Retrieve the history of a Signal for the currently logged in Reporter
     * @param uuid
     * @param what Filters a specific "action"
     * @returns HistoryLogHal
     * @throws ApiError
     */
    public v1MySignalsHistoryList(
        uuid: string,
        what?: string,
    ): CancelablePromise<Array<HistoryLogHal>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/my/signals/{uuid}/history/',
            path: {
                'uuid': uuid,
            },
            query: {
                'what': what,
            },
        });
    }

    /**
     * Detail for the currently logged in Reporter
     * @returns MySignalsLoggedInReporter
     * @throws ApiError
     */
    public v1MySignalsMeRetrieve(): CancelablePromise<MySignalsLoggedInReporter> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/my/signals/me',
        });
    }

    /**
     * Always return an HTTP 200 response without body
     * @param requestBody
     * @returns MySignalsToken
     * @throws ApiError
     */
    public v1MySignalsRequestAuthTokenCreate(
        requestBody: MySignalsToken,
    ): CancelablePromise<MySignalsToken> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/my/signals/request-auth-token',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * A viewset for retrieving areas.
     *
     * Inherits from PublicAreasViewSet and adds authentication.
     * @param code
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param typeCode
     * @returns PaginatedAreaList
     * @throws ApiError
     */
    public v1PrivateAreasList(
        code?: Array<string>,
        page?: number,
        pageSize?: number,
        typeCode?: Array<string>,
    ): CancelablePromise<PaginatedAreaList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/areas/',
            query: {
                'code': code,
                'page': page,
                'page_size': pageSize,
                'type_code': typeCode,
            },
        });
    }

    /**
     * Retrieve a paginated list of area geographies.
     *
     * Returns a paginated response with area geographies.
     * @param geopage A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns AreaGeo
     * @throws ApiError
     */
    public v1PrivateAreasGeographyRetrieve(
        geopage?: number,
        pageSize?: number,
    ): CancelablePromise<AreaGeo> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/areas/geography/',
            query: {
                'geopage': geopage,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Returns a list of usernames filtered by username
     * The username filter needs to provide at least 3 characters or more
     * @param isActive
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param profileDepartmentCode
     * @param username
     * @returns PaginatedUserNameListList
     * @throws ApiError
     */
    public v1PrivateAutocompleteUsernamesList(
        isActive?: boolean,
        page?: number,
        pageSize?: number,
        profileDepartmentCode?: Array<string>,
        username?: string,
    ): CancelablePromise<PaginatedUserNameListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/autocomplete/usernames/',
            query: {
                'is_active': isActive,
                'page': page,
                'page_size': pageSize,
                'profile_department_code': profileDepartmentCode,
                'username': username,
            },
        });
    }

    /**
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedPrivateCategoryList
     * @throws ApiError
     */
    public v1PrivateCategoriesList(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedPrivateCategoryList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/categories/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * @param categoryId
     * @returns PrivateCategoryIcon
     * @throws ApiError
     */
    public v1PrivateCategoriesIconRetrieve(
        categoryId: string,
    ): CancelablePromise<PrivateCategoryIcon> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/categories/{category_id}/icon',
            path: {
                'category_id': categoryId,
            },
        });
    }

    /**
     * @param categoryId
     * @param formData
     * @returns PrivateCategoryIcon
     * @throws ApiError
     */
    public v1PrivateCategoriesIconUpdate(
        categoryId: string,
        formData: PrivateCategoryIcon,
    ): CancelablePromise<PrivateCategoryIcon> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/categories/{category_id}/icon',
            path: {
                'category_id': categoryId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @param categoryId
     * @param formData
     * @returns PrivateCategoryIcon
     * @throws ApiError
     */
    public v1PrivateCategoriesIconPartialUpdate(
        categoryId: string,
        formData?: PatchedPrivateCategoryIcon,
    ): CancelablePromise<PrivateCategoryIcon> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/categories/{category_id}/icon',
            path: {
                'category_id': categoryId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @param categoryId
     * @returns void
     * @throws ApiError
     */
    public v1PrivateCategoriesIconDestroy(
        categoryId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/signals/v1/private/categories/{category_id}/icon',
            path: {
                'category_id': categoryId,
            },
        });
    }

    /**
     * @param id A unique integer value identifying this category.
     * @returns PrivateCategory
     * @throws ApiError
     */
    public v1PrivateCategoriesRetrieve(
        id: number,
    ): CancelablePromise<PrivateCategory> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/categories/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id A unique integer value identifying this category.
     * @param requestBody
     * @returns PrivateCategory
     * @throws ApiError
     */
    public v1PrivateCategoriesUpdate(
        id: number,
        requestBody: PrivateCategory,
    ): CancelablePromise<PrivateCategory> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/categories/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value identifying this category.
     * @param requestBody
     * @returns PrivateCategory
     * @throws ApiError
     */
    public v1PrivateCategoriesPartialUpdate(
        id: number,
        requestBody?: PatchedPrivateCategory,
    ): CancelablePromise<PrivateCategory> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/categories/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * The change log of the selected Category instance
     * This is read-only!
     * @param id A unique integer value identifying this category.
     * @returns PrivateCategoryHistoryHal
     * @throws ApiError
     */
    public v1PrivateCategoriesHistoryList(
        id: number,
    ): CancelablePromise<Array<PrivateCategoryHistoryHal>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/categories/{id}/history/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Private ViewSet to retrieve generated csv files
     * https://stackoverflow.com/a/51936269
     * @returns any No response body
     * @throws ApiError
     */
    public v1PrivateCsvRetrieve(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/csv/',
        });
    }

    /**
     * @param canDirect
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedPrivateDepartmentSerializerListList
     * @throws ApiError
     */
    public v1PrivateDepartmentsList(
        canDirect?: boolean,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedPrivateDepartmentSerializerListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/departments/',
            query: {
                'can_direct': canDirect,
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Create a department
     * @param requestBody
     * @returns PrivateDepartmentSerializerDetail
     * @throws ApiError
     */
    public v1PrivateDepartmentsCreate(
        requestBody: PrivateDepartmentSerializerList,
    ): CancelablePromise<PrivateDepartmentSerializerDetail> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/departments/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Retrieve a department
     * @param id A unique integer value identifying this department.
     * @returns PrivateDepartmentSerializerDetail
     * @throws ApiError
     */
    public v1PrivateDepartmentsRetrieve(
        id: number,
    ): CancelablePromise<PrivateDepartmentSerializerDetail> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/departments/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update a department
     * @param id A unique integer value identifying this department.
     * @param requestBody
     * @returns PrivateDepartmentSerializerDetail
     * @throws ApiError
     */
    public v1PrivateDepartmentsUpdate(
        id: number,
        requestBody: PrivateDepartmentSerializerList,
    ): CancelablePromise<PrivateDepartmentSerializerDetail> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/departments/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Partial update a department
     * @param id A unique integer value identifying this department.
     * @param requestBody
     * @returns PrivateDepartmentSerializerDetail
     * @throws ApiError
     */
    public v1PrivateDepartmentsPartialUpdate(
        id: number,
        requestBody?: PatchedPrivateDepartmentSerializerList,
    ): CancelablePromise<PrivateDepartmentSerializerDetail> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/departments/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * private ViewSet to display/process expressions in the database
     * @param name
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param typeName
     * @returns PaginatedExpressionList
     * @throws ApiError
     */
    public v1PrivateExpressionsList(
        name?: string,
        page?: number,
        pageSize?: number,
        typeName?: Array<string>,
    ): CancelablePromise<PaginatedExpressionList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/expressions/',
            query: {
                'name': name,
                'page': page,
                'page_size': pageSize,
                'type_name': typeName,
            },
        });
    }

    /**
     * private ViewSet to display/process expressions in the database
     * @param requestBody
     * @returns Expression
     * @throws ApiError
     */
    public v1PrivateExpressionsCreate(
        requestBody: Expression,
    ): CancelablePromise<Expression> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/expressions/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * private ViewSet to display/process expressions in the database
     * @param id A unique integer value identifying this Expression.
     * @returns Expression
     * @throws ApiError
     */
    public v1PrivateExpressionsRetrieve(
        id: number,
    ): CancelablePromise<Expression> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/expressions/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * private ViewSet to display/process expressions in the database
     * @param id A unique integer value identifying this Expression.
     * @param requestBody
     * @returns Expression
     * @throws ApiError
     */
    public v1PrivateExpressionsUpdate(
        id: number,
        requestBody: Expression,
    ): CancelablePromise<Expression> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/expressions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * private ViewSet to display/process expressions in the database
     * @param id A unique integer value identifying this Expression.
     * @param requestBody
     * @returns Expression
     * @throws ApiError
     */
    public v1PrivateExpressionsPartialUpdate(
        id: number,
        requestBody?: PatchedExpression,
    ): CancelablePromise<Expression> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/expressions/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * private ViewSet to display/process expressions in the database
     * @param id A unique integer value identifying this Expression.
     * @returns void
     * @throws ApiError
     */
    public v1PrivateExpressionsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/signals/v1/private/expressions/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Returns available identifers for expression type
     * @param type The expression type
     * @returns Expression
     * @throws ApiError
     */
    public v1PrivateExpressionsContextRetrieve(
        type: string,
    ): CancelablePromise<Expression> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/expressions/context/',
            query: {
                'type': type,
            },
        });
    }

    /**
     * Validate expression for a certain expression type
     * @param expression The expression to validate
     * @param type The expression type
     * @returns Expression
     * @throws ApiError
     */
    public v1PrivateExpressionsValidateRetrieve(
        expression: string,
        type: string,
    ): CancelablePromise<Expression> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/expressions/validate/',
            query: {
                'expression': expression,
                'type': type,
            },
        });
    }

    /**
     * Detail for the currently logged in user
     * @returns UserDetailHAL
     * @throws ApiError
     */
    public v1PrivateMeRetrieve(): CancelablePromise<UserDetailHAL> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/me/',
        });
    }

    /**
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedStoredSignalFilterList
     * @throws ApiError
     */
    public v1PrivateMeFiltersList(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedStoredSignalFilterList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/me/filters/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * @param requestBody
     * @returns StoredSignalFilter
     * @throws ApiError
     */
    public v1PrivateMeFiltersCreate(
        requestBody: StoredSignalFilter,
    ): CancelablePromise<StoredSignalFilter> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/me/filters/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value identifying this stored signal filter.
     * @returns StoredSignalFilter
     * @throws ApiError
     */
    public v1PrivateMeFiltersRetrieve(
        id: number,
    ): CancelablePromise<StoredSignalFilter> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/me/filters/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id A unique integer value identifying this stored signal filter.
     * @param requestBody
     * @returns StoredSignalFilter
     * @throws ApiError
     */
    public v1PrivateMeFiltersUpdate(
        id: number,
        requestBody: StoredSignalFilter,
    ): CancelablePromise<StoredSignalFilter> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/me/filters/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value identifying this stored signal filter.
     * @param requestBody
     * @returns StoredSignalFilter
     * @throws ApiError
     */
    public v1PrivateMeFiltersPartialUpdate(
        id: number,
        requestBody?: PatchedStoredSignalFilter,
    ): CancelablePromise<StoredSignalFilter> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/me/filters/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value identifying this stored signal filter.
     * @returns void
     * @throws ApiError
     */
    public v1PrivateMeFiltersDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/signals/v1/private/me/filters/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * List all permissions
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedPermissionList
     * @throws ApiError
     */
    public v1PrivatePermissionsList(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedPermissionList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/permissions/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Retrieve a permission
     * @param id A unique integer value identifying this recht.
     * @returns Permission
     * @throws ApiError
     */
    public v1PrivatePermissionsRetrieve(
        id: number,
    ): CancelablePromise<Permission> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/permissions/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Count all Signals that have an "open" state and return a summary per Category.
     *
     * It is also possible to filter on a period using the "start" and "end" filters (query params)
     * @param end
     * @param start
     * @returns ReportSignalsPerCategory
     * @throws ApiError
     */
    public v1PrivateReportsSignalsOpenList(
        end?: string,
        start?: string,
    ): CancelablePromise<Array<ReportSignalsPerCategory>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/reports/signals/open/',
            query: {
                'end': end,
                'start': start,
            },
        });
    }

    /**
     * Count all Signals that are in the "reopen requested" state and return a summary per Category.
     *
     * It is also possible to filter on the period the state change was made using the "start" and
     * "end" filters (query params)
     * @param end
     * @param start
     * @returns ReportSignalsPerCategory
     * @throws ApiError
     */
    public v1PrivateReportsSignalsReopenRequestedList(
        end?: string,
        start?: string,
    ): CancelablePromise<Array<ReportSignalsPerCategory>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/reports/signals/reopen-requested/',
            query: {
                'end': end,
                'start': start,
            },
        });
    }

    /**
     * List all roles
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedRoleList
     * @throws ApiError
     */
    public v1PrivateRolesList(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedRoleList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/roles/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Create a role
     * @param requestBody
     * @returns Role
     * @throws ApiError
     */
    public v1PrivateRolesCreate(
        requestBody: Role,
    ): CancelablePromise<Role> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/roles/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Retrieve a role
     * @param id A unique integer value identifying this groep.
     * @returns Role
     * @throws ApiError
     */
    public v1PrivateRolesRetrieve(
        id: number,
    ): CancelablePromise<Role> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/roles/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update a role
     * @param id A unique integer value identifying this groep.
     * @param requestBody
     * @returns Role
     * @throws ApiError
     */
    public v1PrivateRolesUpdate(
        id: number,
        requestBody: Role,
    ): CancelablePromise<Role> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/roles/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update a role
     * @param id A unique integer value identifying this groep.
     * @param requestBody
     * @returns Role
     * @throws ApiError
     */
    public v1PrivateRolesPartialUpdate(
        id: number,
        requestBody?: PatchedRole,
    ): CancelablePromise<Role> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/roles/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a role
     * @param id A unique integer value identifying this groep.
     * @returns void
     * @throws ApiError
     */
    public v1PrivateRolesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/signals/v1/private/roles/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Add custom serializer for detail view
     * @param ordering Order the results by a specific field. Currently the only valid options are "created_at" and "-created_at".
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param q The search term.
     * @returns PaginatedPrivateSignalSerializerListList
     * @throws ApiError
     */
    public v1PrivateSearchList(
        ordering?: string,
        page?: number,
        pageSize?: number,
        q?: string,
    ): CancelablePromise<PaginatedPrivateSignalSerializerListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/search/',
            query: {
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'q': q,
            },
        });
    }

    /**
     * List of signals
     * @param addressText
     * @param areaCode
     * @param areaTypeCode
     * @param assignedUserEmail
     * @param buurtCode
     * @param categoryId
     * @param categorySlug
     * @param contactDetails
     * @param createdAfter
     * @param createdBefore
     * @param directingDepartment
     * @param feedback
     * @param hasChangedChildren * `True` - True
     * * `true` - true
     * * `True` - True
     * * `1` - 1
     * * `False` - False
     * * `false` - false
     * * `False` - False
     * * `0` - 0
     * @param id
     * @param incidentDate
     * @param incidentDateAfter
     * @param incidentDateBefore
     * @param kind
     * @param maincategorySlug
     * @param noteKeyword
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param priority * `low` - Low
     * * `normal` - Normal
     * * `high` - High
     * @param punctuality Punctuality
     * @param reporterEmail
     * @param routingDepartmentCode
     * @param source
     * @param stadsdeel
     * @param status Melding status
     * @param type * `SIG` - Signal
     * * `REQ` - Request
     * * `QUE` - Question
     * * `COM` - Complaint
     * * `MAI` - Maintenance
     * @param updatedAfter
     * @param updatedBefore
     * @returns PaginatedPrivateSignalSerializerListList
     * @throws ApiError
     */
    public v1PrivateSignalsList(
        addressText?: string,
        areaCode?: Array<string | null>,
        areaTypeCode?: string | null,
        assignedUserEmail?: string,
        buurtCode?: Array<string | null>,
        categoryId?: Array<number>,
        categorySlug?: Array<string>,
        contactDetails?: Array<string>,
        createdAfter?: string,
        createdBefore?: string,
        directingDepartment?: Array<string>,
        feedback?: string,
        hasChangedChildren?: Array<boolean>,
        id?: number,
        incidentDate?: string,
        incidentDateAfter?: string,
        incidentDateBefore?: string,
        kind?: Array<string>,
        maincategorySlug?: Array<string>,
        noteKeyword?: string,
        ordering?: string,
        page?: number,
        pageSize?: number,
        priority?: Array<'high' | 'low' | 'normal'>,
        punctuality?: string,
        reporterEmail?: string,
        routingDepartmentCode?: Array<string>,
        source?: Array<string>,
        stadsdeel?: Array<string | null>,
        status?: Array<string>,
        type?: Array<'COM' | 'MAI' | 'QUE' | 'REQ' | 'SIG'>,
        updatedAfter?: string,
        updatedBefore?: string,
    ): CancelablePromise<PaginatedPrivateSignalSerializerListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/',
            query: {
                'address_text': addressText,
                'area_code': areaCode,
                'area_type_code': areaTypeCode,
                'assigned_user_email': assignedUserEmail,
                'buurt_code': buurtCode,
                'category_id': categoryId,
                'category_slug': categorySlug,
                'contact_details': contactDetails,
                'created_after': createdAfter,
                'created_before': createdBefore,
                'directing_department': directingDepartment,
                'feedback': feedback,
                'has_changed_children': hasChangedChildren,
                'id': id,
                'incident_date': incidentDate,
                'incident_date_after': incidentDateAfter,
                'incident_date_before': incidentDateBefore,
                'kind': kind,
                'maincategory_slug': maincategorySlug,
                'note_keyword': noteKeyword,
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'priority': priority,
                'punctuality': punctuality,
                'reporter_email': reporterEmail,
                'routing_department_code': routingDepartmentCode,
                'source': source,
                'stadsdeel': stadsdeel,
                'status': status,
                'type': type,
                'updated_after': updatedAfter,
                'updated_before': updatedBefore,
            },
        });
    }

    /**
     * Create a new signal
     * @param requestBody
     * @returns PrivateSignalSerializerList
     * @throws ApiError
     */
    public v1PrivateSignalsCreate(
        requestBody: PrivateSignalSerializerList,
    ): CancelablePromise<PrivateSignalSerializerList> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/signals/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param parentLookupSignalPk
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedPrivateSignalAttachmentList
     * @throws ApiError
     */
    public v1PrivateSignalsAttachmentsList(
        parentLookupSignalPk: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedPrivateSignalAttachmentList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{parent_lookup__signal__pk}/attachments/',
            path: {
                'parent_lookup__signal__pk': parentLookupSignalPk,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * @param parentLookupSignalPk
     * @param formData
     * @returns PrivateSignalAttachment
     * @throws ApiError
     */
    public v1PrivateSignalsAttachmentsCreate(
        parentLookupSignalPk: string,
        formData: PrivateSignalAttachment,
    ): CancelablePromise<PrivateSignalAttachment> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/signals/{parent_lookup__signal__pk}/attachments/',
            path: {
                'parent_lookup__signal__pk': parentLookupSignalPk,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * @param id A unique integer value identifying this attachment.
     * @param parentLookupSignalPk
     * @returns PrivateSignalAttachment
     * @throws ApiError
     */
    public v1PrivateSignalsAttachmentsRetrieve(
        id: number,
        parentLookupSignalPk: string,
    ): CancelablePromise<PrivateSignalAttachment> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{parent_lookup__signal__pk}/attachments/{id}/',
            path: {
                'id': id,
                'parent_lookup__signal__pk': parentLookupSignalPk,
            },
        });
    }

    /**
     * @param id A unique integer value identifying this attachment.
     * @param parentLookupSignalPk
     * @param requestBody
     * @returns PrivateSignalAttachmentUpdate
     * @throws ApiError
     */
    public v1PrivateSignalsAttachmentsUpdate(
        id: number,
        parentLookupSignalPk: string,
        requestBody?: PrivateSignalAttachmentUpdate,
    ): CancelablePromise<PrivateSignalAttachmentUpdate> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/signals/{parent_lookup__signal__pk}/attachments/{id}/',
            path: {
                'id': id,
                'parent_lookup__signal__pk': parentLookupSignalPk,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value identifying this attachment.
     * @param parentLookupSignalPk
     * @param requestBody
     * @returns PrivateSignalAttachmentUpdate
     * @throws ApiError
     */
    public v1PrivateSignalsAttachmentsPartialUpdate(
        id: number,
        parentLookupSignalPk: string,
        requestBody?: PatchedPrivateSignalAttachmentUpdate,
    ): CancelablePromise<PrivateSignalAttachmentUpdate> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/signals/{parent_lookup__signal__pk}/attachments/{id}/',
            path: {
                'id': id,
                'parent_lookup__signal__pk': parentLookupSignalPk,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id A unique integer value identifying this attachment.
     * @param parentLookupSignalPk
     * @returns void
     * @throws ApiError
     */
    public v1PrivateSignalsAttachmentsDestroy(
        id: number,
        parentLookupSignalPk: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/signals/v1/private/signals/{parent_lookup__signal__pk}/attachments/{id}/',
            path: {
                'id': id,
                'parent_lookup__signal__pk': parentLookupSignalPk,
            },
        });
    }

    /**
     * @param parentLookupSignalId
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param state * `new` - New
     * * `verification_email_sent` - Verification email sent
     * * `cancelled` - Cancelled
     * * `approved` - Approved
     * @returns PaginatedSignalReporterList
     * @throws ApiError
     */
    public v1PrivateSignalsReportersList(
        parentLookupSignalId: string,
        page?: number,
        pageSize?: number,
        state?: 'approved' | 'cancelled' | 'new' | 'verification_email_sent',
    ): CancelablePromise<PaginatedSignalReporterList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{parent_lookup__signal_id}/reporters/',
            path: {
                'parent_lookup__signal_id': parentLookupSignalId,
            },
            query: {
                'page': page,
                'page_size': pageSize,
                'state': state,
            },
        });
    }

    /**
     * @param parentLookupSignalId
     * @param requestBody
     * @returns SignalReporter
     * @throws ApiError
     */
    public v1PrivateSignalsReportersCreate(
        parentLookupSignalId: string,
        requestBody: SignalReporter,
    ): CancelablePromise<SignalReporter> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/signals/{parent_lookup__signal_id}/reporters/',
            path: {
                'parent_lookup__signal_id': parentLookupSignalId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Cancel a reporter, this allows cancelling a reporter update.
     * Cancelling is allowed, when the state of the reporter is "new" or "verification_email_sent"
     * and the reporter is not the original/first reporter of the signal.
     * Optionally a reason for the cancellation can be provided using the reason field.
     * @param id A unique integer value identifying this reporter.
     * @param parentLookupSignalId
     * @param requestBody
     * @returns SignalReporter
     * @throws ApiError
     */
    public v1PrivateSignalsReportersCancelCreate(
        id: number,
        parentLookupSignalId: string,
        requestBody?: CancelSignalReporter,
    ): CancelablePromise<SignalReporter> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/signals/{parent_lookup__signal_id}/reporters/{id}/cancel/',
            path: {
                'id': id,
                'parent_lookup__signal_id': parentLookupSignalId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Retrieve a signal
     * @param id A unique integer value identifying this signal.
     * @returns PrivateSignalSerializerDetail
     * @throws ApiError
     */
    public v1PrivateSignalsRetrieve(
        id: number,
    ): CancelablePromise<PrivateSignalSerializerDetail> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Partial update a signal
     * @param id A unique integer value identifying this signal.
     * @param requestBody
     * @returns PrivateSignalSerializerDetail
     * @throws ApiError
     */
    public v1PrivateSignalsPartialUpdate(
        id: number,
        requestBody?: PatchedPrivateSignalSerializerList,
    ): CancelablePromise<PrivateSignalSerializerDetail> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/signals/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Show abridged version of child signals for a given parent signal.
     * @param id A unique integer value identifying this signal.
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedAbridgedChildSignalList
     * @throws ApiError
     */
    public v1PrivateSignalsChildrenList(
        id: number,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedAbridgedChildSignalList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{id}/children/',
            path: {
                'id': id,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * @param id
     * @returns SignalContext
     * @throws ApiError
     */
    public v1PrivateSignalsContextRetrieve(
        id: string,
    ): CancelablePromise<SignalContext> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{id}/context/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get an overview of signals in the same category and within a certain radius of the signal
     * @param id
     * @returns any
     * @throws ApiError
     */
    public v1PrivateSignalsContextNearGeographyRetrieve(
        id: string,
    ): CancelablePromise<{
        type?: 'FeatureCollection';
        features?: Array<{
            type?: 'Feature';
            geometry?: {
                type?: 'Point';
                coordinates?: Array<number>;
            };
            properties?: {
                state?: 'm' | 'i' | 'b' | 'h' | 'ingepland' | 'ready to send' | 'o' | 'a' | 'reopened' | 's' | 'closure requested' | 'reaction requested' | 'reaction received' | 'forward to external';
                state_display?: string;
            };
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{id}/context/near/geography/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get an overview of signals from the same reporter
     * @param id
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedSignalContextReporterList
     * @throws ApiError
     */
    public v1PrivateSignalsContextReporterList(
        id: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedSignalContextReporterList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{id}/context/reporter/',
            path: {
                'id': id,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Render the email preview before transitioning to a specific status.
     * @param id A unique integer value identifying this signal.
     * @param requestBody
     * @returns EmailPreview
     * @throws ApiError
     */
    public v1PrivateSignalsEmailPreviewCreate(
        id: number,
        requestBody: EmailPreviewPost,
    ): CancelablePromise<EmailPreview> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/signals/{id}/email/preview/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * History endpoint filterable by action.
     * @param id A unique integer value identifying this signal.
     * @param what Filters a specific "action"
     * @returns HistoryLogHal
     * @throws ApiError
     */
    public v1PrivateSignalsHistoryList(
        id: number,
        what?: string,
    ): CancelablePromise<Array<HistoryLogHal>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{id}/history/',
            path: {
                'id': id,
            },
            query: {
                'what': what,
            },
        });
    }

    /**
     * Download the Signal as a PDF.
     * @param id A unique integer value identifying this signal.
     * @returns any No response body
     * @throws ApiError
     */
    public v1PrivateSignalsPdfRetrieve(
        id: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/{id}/pdf/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param after
     * @param before
     * @param categorySlug
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedSignalIdListList
     * @throws ApiError
     */
    public v1PrivateSignalsCategoryRemovedList(
        after?: string,
        before?: string,
        categorySlug?: Array<string>,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedSignalIdListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/category/removed/',
            query: {
                'after': after,
                'before': before,
                'category_slug': categorySlug,
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * GeoJSON of all signals
     * @returns any
     * @throws ApiError
     */
    public v1PrivateSignalsGeographyRetrieve(): CancelablePromise<{
        type?: 'FeatureCollection';
        features?: Array<{
            type?: 'Feature';
            geometry?: {
                type?: 'Point';
                coordinates?: Array<number>;
            };
            properties?: {
                id?: number;
                created_at?: string;
            };
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/geography/',
        });
    }

    /**
     * @param after
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedSignalIdListList
     * @throws ApiError
     */
    public v1PrivateSignalsPromotedParentList(
        after?: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedSignalIdListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/signals/promoted/parent/',
            query: {
                'after': after,
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Display all sources
     * @param canBeSelected
     * @param isActive
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedSourceList
     * @throws ApiError
     */
    public v1PrivateSourcesList(
        canBeSelected?: boolean,
        isActive?: boolean,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedSourceList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/sources/',
            query: {
                'can_be_selected': canBeSelected,
                'is_active': isActive,
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Display all sources
     * @param id A unique integer value identifying this source.
     * @returns Source
     * @throws ApiError
     */
    public v1PrivateSourcesRetrieve(
        id: number,
    ): CancelablePromise<Source> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/sources/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Endpoint to manage status messages.
     *
     * A status message can be used as a template for a response to a reporter on a state
     * transition of a signal.
     *
     * Status messages contain a state field that links it to the
     * state that the signal will be transitioned to and can be attached to multiple
     * categories. Within each category it has a position, that can be used to determine
     * the order in which the status messages should be displayed to the user.
     * @param active
     * @param categoryId
     * @param ordering Which field to use when ordering the results.
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param state
     * @returns PaginatedStatusMessageList
     * @throws ApiError
     */
    public v1PrivateStatusMessagesList(
        active?: boolean,
        categoryId?: number,
        ordering?: string,
        page?: number,
        pageSize?: number,
        state?: Array<string>,
    ): CancelablePromise<PaginatedStatusMessageList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/status-messages/',
            query: {
                'active': active,
                'category_id': categoryId,
                'ordering': ordering,
                'page': page,
                'page_size': pageSize,
                'state': state,
            },
        });
    }

    /**
     * Endpoint to manage status messages.
     *
     * A status message can be used as a template for a response to a reporter on a state
     * transition of a signal.
     *
     * Status messages contain a state field that links it to the
     * state that the signal will be transitioned to and can be attached to multiple
     * categories. Within each category it has a position, that can be used to determine
     * the order in which the status messages should be displayed to the user.
     * @param requestBody
     * @returns StatusMessage
     * @throws ApiError
     */
    public v1PrivateStatusMessagesCreate(
        requestBody: StatusMessage,
    ): CancelablePromise<StatusMessage> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/status-messages/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Endpoint to manage status messages.
     *
     * A status message can be used as a template for a response to a reporter on a state
     * transition of a signal.
     *
     * Status messages contain a state field that links it to the
     * state that the signal will be transitioned to and can be attached to multiple
     * categories. Within each category it has a position, that can be used to determine
     * the order in which the status messages should be displayed to the user.
     * @param id A unique integer value identifying this Standaardtekst.
     * @returns StatusMessage
     * @throws ApiError
     */
    public v1PrivateStatusMessagesRetrieve(
        id: number,
    ): CancelablePromise<StatusMessage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/status-messages/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Endpoint to manage status messages.
     *
     * A status message can be used as a template for a response to a reporter on a state
     * transition of a signal.
     *
     * Status messages contain a state field that links it to the
     * state that the signal will be transitioned to and can be attached to multiple
     * categories. Within each category it has a position, that can be used to determine
     * the order in which the status messages should be displayed to the user.
     * @param id A unique integer value identifying this Standaardtekst.
     * @param requestBody
     * @returns StatusMessage
     * @throws ApiError
     */
    public v1PrivateStatusMessagesUpdate(
        id: number,
        requestBody: StatusMessage,
    ): CancelablePromise<StatusMessage> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/private/status-messages/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Endpoint to manage status messages.
     *
     * A status message can be used as a template for a response to a reporter on a state
     * transition of a signal.
     *
     * Status messages contain a state field that links it to the
     * state that the signal will be transitioned to and can be attached to multiple
     * categories. Within each category it has a position, that can be used to determine
     * the order in which the status messages should be displayed to the user.
     * @param id A unique integer value identifying this Standaardtekst.
     * @param requestBody
     * @returns StatusMessage
     * @throws ApiError
     */
    public v1PrivateStatusMessagesPartialUpdate(
        id: number,
        requestBody?: PatchedStatusMessage,
    ): CancelablePromise<StatusMessage> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/status-messages/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Endpoint to manage status messages.
     *
     * A status message can be used as a template for a response to a reporter on a state
     * transition of a signal.
     *
     * Status messages contain a state field that links it to the
     * state that the signal will be transitioned to and can be attached to multiple
     * categories. Within each category it has a position, that can be used to determine
     * the order in which the status messages should be displayed to the user.
     * @param id A unique integer value identifying this Standaardtekst.
     * @returns void
     * @throws ApiError
     */
    public v1PrivateStatusMessagesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/signals/v1/private/status-messages/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param categoryId
     * @param requestBody
     * @returns StatusMessageCategoryPosition
     * @throws ApiError
     */
    public v1PrivateStatusMessagesCategoryCreate(
        categoryId: string,
        requestBody: StatusMessageCategoryPosition,
    ): CancelablePromise<StatusMessageCategoryPosition> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/status-messages/category/{category_id}/',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * This will perform a lookup using elasticsearch using a "fuzzy" search, which allows
     * for typos, misspelling, pluralization, etc...
     * It allows for filtering based on the 'state' key and by the 'active' state by using
     * querystring parameters 'state' and 'active' respectively.
     * When no search term is provided using querystring parameter 'q', all status messages
     * will be returned (optionally filtered using the 'state' and 'active' filters).
     * When a search term is provided a 'highlight' section is available for both the 'title'
     * and 'text' field, which can be used to display the title and text of the status messages
     * in the results with the search term highlighted.
     * Pagination is provided using the 'page_size' and 'page' querystring parameters.
     * In the results there is a 'facets' section available, which provides counts for every
     * filter option.
     * @param active Filter the search results on the "active" state of the status message.
     * @param page The page number of the paginated results.
     * @param pageSize Number of results returned per page.
     * @param q The search term.
     * @param state Filter the search results on state code (add parameter to querystring multiple times to filter on multiple states).
     * @returns StatusMessageList
     * @throws ApiError
     */
    public v1PrivateStatusMessagesSearchRetrieve(
        active?: boolean,
        page?: number,
        pageSize?: number,
        q?: string,
        state?: string,
    ): CancelablePromise<StatusMessageList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/status-messages/search/',
            query: {
                'active': active,
                'page': page,
                'page_size': pageSize,
                'q': q,
                'state': state,
            },
        });
    }

    /**
     * @param slug
     * @returns StateStatusMessageTemplate
     * @throws ApiError
     */
    public v1PrivateTermsCategoriesStatusMessageTemplatesRetrieve(
        slug: string,
    ): CancelablePromise<StateStatusMessageTemplate> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/terms/categories/{slug}/status-message-templates/',
            path: {
                'slug': slug,
            },
        });
    }

    /**
     * @param slug
     * @param requestBody
     * @returns StateStatusMessageTemplate
     * @throws ApiError
     */
    public v1PrivateTermsCategoriesStatusMessageTemplatesCreate(
        slug: string,
        requestBody: StateStatusMessageTemplate,
    ): CancelablePromise<StateStatusMessageTemplate> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/terms/categories/{slug}/status-message-templates/',
            path: {
                'slug': slug,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param slug
     * @param subSlug
     * @returns StateStatusMessageTemplate
     * @throws ApiError
     */
    public v1PrivateTermsCategoriesSubCategoriesStatusMessageTemplatesRetrieve(
        slug: string,
        subSlug: string,
    ): CancelablePromise<StateStatusMessageTemplate> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/terms/categories/{slug}/sub_categories/{sub_slug}/status-message-templates/',
            path: {
                'slug': slug,
                'sub_slug': subSlug,
            },
        });
    }

    /**
     * @param slug
     * @param subSlug
     * @param requestBody
     * @returns StateStatusMessageTemplate
     * @throws ApiError
     */
    public v1PrivateTermsCategoriesSubCategoriesStatusMessageTemplatesCreate(
        slug: string,
        subSlug: string,
        requestBody: StateStatusMessageTemplate,
    ): CancelablePromise<StateStatusMessageTemplate> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/terms/categories/{slug}/sub_categories/{sub_slug}/status-message-templates/',
            path: {
                'slug': slug,
                'sub_slug': subSlug,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Create an I18Next translation file from the JSON data.
     *
     * Args:
     * request (Request): The incoming request containing JSON data.
     *
     * Returns:
     * Response: A success response with the created JSON data.
     * @returns any No response body
     * @throws ApiError
     */
    public v1PrivateTranslationsCreate(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/translations/',
        });
    }

    /**
     * List all users
     * @param id
     * @param isActive
     * @param order Volgorde
     *
     * * `username` - Gebruikersnaam
     * * `-username` - Gebruikersnaam (aflopend)
     * * `is_active` - Is active
     * * `-is_active` - Is active (aflopend)
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param profileDepartmentCode
     * @param role
     * @param username
     * @returns PaginatedUserListHALList
     * @throws ApiError
     */
    public v1PrivateUsersList(
        id?: number,
        isActive?: boolean,
        order?: Array<'-is_active' | '-username' | 'is_active' | 'username'>,
        page?: number,
        pageSize?: number,
        profileDepartmentCode?: Array<string>,
        role?: Array<string>,
        username?: string,
    ): CancelablePromise<PaginatedUserListHALList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/users/',
            query: {
                'id': id,
                'is_active': isActive,
                'order': order,
                'page': page,
                'page_size': pageSize,
                'profile_department_code': profileDepartmentCode,
                'role': role,
                'username': username,
            },
        });
    }

    /**
     * Create a user
     * @param requestBody
     * @returns UserDetailHAL
     * @throws ApiError
     */
    public v1PrivateUsersCreate(
        requestBody: UserDetailHAL,
    ): CancelablePromise<UserDetailHAL> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/private/users/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Retrieve a user
     * @param id A unique integer value identifying this gebruiker.
     * @returns UserDetailHAL
     * @throws ApiError
     */
    public v1PrivateUsersRetrieve(
        id: number,
    ): CancelablePromise<UserDetailHAL> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/users/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update a user
     * @param id A unique integer value identifying this gebruiker.
     * @param requestBody
     * @returns UserDetailHAL
     * @throws ApiError
     */
    public v1PrivateUsersPartialUpdate(
        id: number,
        requestBody?: PatchedUserDetailHAL,
    ): CancelablePromise<UserDetailHAL> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/private/users/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * The change log of the selected User instance
     * This is read-only!
     * @param id A unique integer value identifying this gebruiker.
     * @returns PrivateUserHistoryHal
     * @throws ApiError
     */
    public v1PrivateUsersHistoryRetrieve(
        id: number,
    ): CancelablePromise<PrivateUserHistoryHal> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/private/users/{id}/history/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * A viewset for retrieving areas.
     * @param code
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param typeCode
     * @returns PaginatedAreaList
     * @throws ApiError
     */
    public v1PublicAreasList(
        code?: Array<string>,
        page?: number,
        pageSize?: number,
        typeCode?: Array<string>,
    ): CancelablePromise<PaginatedAreaList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/areas/',
            query: {
                'code': code,
                'page': page,
                'page_size': pageSize,
                'type_code': typeCode,
            },
        });
    }

    /**
     * Retrieve a paginated list of area geographies.
     *
     * Returns a paginated response with area geographies.
     * @param geopage A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns AreaGeo
     * @throws ApiError
     */
    public v1PublicAreasGeographyRetrieve(
        geopage?: number,
        pageSize?: number,
    ): CancelablePromise<AreaGeo> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/areas/geography/',
            query: {
                'geopage': geopage,
                'page_size': pageSize,
            },
        });
    }

    /**
     * View to receive complaint/client feedback.
     * @param token A unique value identifying this feedback.
     * @returns Feedback
     * @throws ApiError
     */
    public v1PublicFeedbackFormsRetrieve(
        token: string,
    ): CancelablePromise<Feedback> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/feedback/forms/{token}/',
            path: {
                'token': token,
            },
        });
    }

    /**
     * View to receive complaint/client feedback.
     * @param token A unique value identifying this feedback.
     * @param requestBody
     * @returns Feedback
     * @throws ApiError
     */
    public v1PublicFeedbackFormsUpdate(
        token: string,
        requestBody: Feedback,
    ): CancelablePromise<Feedback> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/signals/v1/public/feedback/forms/{token}/',
            path: {
                'token': token,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * View to receive complaint/client feedback.
     * @param token A unique value identifying this feedback.
     * @param requestBody
     * @returns Feedback
     * @throws ApiError
     */
    public v1PublicFeedbackFormsPartialUpdate(
        token: string,
        requestBody?: PatchedFeedback,
    ): CancelablePromise<Feedback> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/signals/v1/public/feedback/forms/{token}/',
            path: {
                'token': token,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * View to list all currently visible Standard Answers.
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedStandardAnswerList
     * @throws ApiError
     */
    public v1PublicFeedbackStandardAnswersList(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedStandardAnswerList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/feedback/standard_answers/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * @param mainSlug Hoofd categorie
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @param subSlug Sub categorie
     * @returns PaginatedPublicQuestionSerializerDetailList
     * @throws ApiError
     */
    public v1PublicQuestionsList(
        mainSlug?: string,
        page?: number,
        pageSize?: number,
        subSlug?: string,
    ): CancelablePromise<PaginatedPublicQuestionSerializerDetailList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/questions/',
            query: {
                'main_slug': mainSlug,
                'page': page,
                'page_size': pageSize,
                'sub_slug': subSlug,
            },
        });
    }

    /**
     * Verify the token for reporter email verification.
     * @param requestBody
     * @returns EmailVerification
     * @throws ApiError
     */
    public v1PublicReporterVerifyEmailCreate(
        requestBody: EmailVerification,
    ): CancelablePromise<EmailVerification> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/public/reporter/verify-email',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Create a signal
     * @param requestBody
     * @returns PublicSignalSerializerDetail
     * @throws ApiError
     */
    public v1PublicSignalsCreate(
        requestBody: PublicSignalCreate,
    ): CancelablePromise<PublicSignalSerializerDetail> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/public/signals/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Retrieve a public signal
     * @param uuid
     * @returns PublicSignalSerializerDetail
     * @throws ApiError
     */
    public v1PublicSignalsRetrieve(
        uuid: string,
    ): CancelablePromise<PublicSignalSerializerDetail> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/signals/{uuid}/',
            path: {
                'uuid': uuid,
            },
        });
    }

    /**
     * @param uuid
     * @param formData
     * @returns PublicSignalAttachment
     * @throws ApiError
     */
    public uploadFile(
        uuid: string,
        formData: PublicSignalAttachment,
    ): CancelablePromise<PublicSignalAttachment> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/signals/v1/public/signals/{uuid}/attachments/',
            path: {
                'uuid': uuid,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * GeoJSON of all signals that can be shown on a public map.
     * @param bbox
     * @param categorySlug
     * @param lat
     * @param lon
     * @param maincategorySlug
     * @param ordering Which field to use when ordering the results.
     * @returns any
     * @throws ApiError
     */
    public v1PublicSignalsGeographyRetrieve(
        bbox?: string,
        categorySlug?: Array<string>,
        lat?: number,
        lon?: number,
        maincategorySlug?: Array<string>,
        ordering?: string,
    ): CancelablePromise<{
        type?: 'FeatureCollection';
        features?: Array<{
            type?: 'Feature';
            geometry?: {
                type?: 'Point';
                coordinates?: Array<number>;
            };
            properties?: {
                category?: {
                    name?: string;
                    slug?: string;
                    parent?: {
                        name?: string;
                        slug?: string;
                    };
                };
                created_at?: string;
            };
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/signals/geography/',
            query: {
                'bbox': bbox,
                'category_slug': categorySlug,
                'lat': lat,
                'lon': lon,
                'maincategory_slug': maincategorySlug,
                'ordering': ordering,
            },
        });
    }

    /**
     * Add custom serializer for detail view
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedCategoryList
     * @throws ApiError
     */
    public v1PublicTermsCategoriesList(
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedCategoryList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/terms/categories/',
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Add custom serializer for detail view
     * @param parentLookupParentSlug
     * @param page A page number within the paginated result set.
     * @param pageSize Number of results to return per page.
     * @returns PaginatedCategoryList
     * @throws ApiError
     */
    public v1PublicTermsCategoriesSubCategoriesList(
        parentLookupParentSlug: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<PaginatedCategoryList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/terms/categories/{parent_lookup_parent__slug}/sub_categories/',
            path: {
                'parent_lookup_parent__slug': parentLookupParentSlug,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
        });
    }

    /**
     * Add custom serializer for detail view
     * @param parentLookupParentSlug
     * @param slug
     * @returns Category
     * @throws ApiError
     */
    public v1PublicTermsCategoriesSubCategoriesRetrieve(
        parentLookupParentSlug: string,
        slug: string,
    ): CancelablePromise<Category> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/terms/categories/{parent_lookup_parent__slug}/sub_categories/{slug}/',
            path: {
                'parent_lookup_parent__slug': parentLookupParentSlug,
                'slug': slug,
            },
        });
    }

    /**
     * Add custom serializer for detail view
     * @param slug
     * @returns Category
     * @throws ApiError
     */
    public v1PublicTermsCategoriesRetrieve(
        slug: string,
    ): CancelablePromise<Category> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/terms/categories/{slug}/',
            path: {
                'slug': slug,
            },
        });
    }

    /**
     * Retrieve the latest I18Next translation file.
     *
     * Args:
     * request (Request): The incoming request.
     * *args (set): Additional positional arguments.
     * **kwargs (dict): Additional keyword arguments.
     *
     * Returns:
     * Response | FileResponse: A FileResponse with the file content or Response (404) if the file doesn't exist.
     * @returns any No response body
     * @throws ApiError
     */
    public v1PublicTranslationsJsonRetrieve(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/public/translations.json',
        });
    }

    /**
     * Used for the curies namespace, at this moment it is just a dummy landing page so that we have
     * a valid URI that resolves
     *
     * TODO: Implement HAL standard for curies in the future
     * @returns any No response body
     * @throws ApiError
     */
    public v1RelationsRetrieve(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/signals/v1/relations/',
        });
    }

}
