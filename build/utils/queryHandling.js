"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandling = void 0;
var QueryHandling = /** @class */ (function () {
    // query for mongoose and queryString for express
    function QueryHandling(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    QueryHandling.prototype.filter = function () {
        // BUILD THE QUERY
        // 1A)Filtering
        var queryObj = __assign({}, this.queryString);
        // exclude in query string as these filters are not to be found from database since they were not specified in Model Schema
        // this doesnt need to be in the queryObj when finding documents
        var excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(function (el) { return delete queryObj[el]; });
        // 1B) Advanced Filtering
        // Converting queries to a suitable filter
        var queryStr = JSON.stringify(queryObj); // convert object to a string
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$".concat(match); });
        // This replaces the formating in the queryString to include $
        //ex. {{URL}}/api/v1/tours?duration[gte]=10
        // { difficulty: 'easy', duration: { gte: '5' } }
        // { difficulty: 'easy', duration: { $gte: 5 } }
        // gte,gt,lte,lt
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };
    QueryHandling.prototype.sort = function () {
        // Multiple sort queries causes error as they result as a string = added hpp for parameter pollution
        if (this.queryString.sort) {
            // this.queryString.sort = ?sort= price,ratingsAverage....etc
            var sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
            // sort('price ratingsAverage')
        }
        else {
            this.query = this.query.sort("-date");
        }
        return this;
    };
    QueryHandling.prototype.limitFields = function () {
        // 3) Fields (fields=etc,etc)
        if (this.queryString.fields) {
            var fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select("-__v");
        }
        return this;
    };
    QueryHandling.prototype.paginate = function () {
        // 4) Pagination (page and limit)
        var page = parseInt(this.queryString.page, 10) || 1;
        var limit = parseInt(this.queryString.limit, 10) || 100;
        var skip = (page - 1) * limit;
        // page=2&limit=10 , 1-10 : page 1, 11-20: page 2
        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
    return QueryHandling;
}());
exports.QueryHandling = QueryHandling;
