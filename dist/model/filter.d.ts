declare type type = "$gt" | "$gte" | "$lt" | "$lte" | "$equals" | "$!equals" | "$in" | "$!in" | "$contains" | "$!contains";
declare type filterItem<T extends object> = {
    [key in keyof T]?: string | null | {
        [key in type]?: any;
    };
};
declare type filter<T extends object> = {
    $config?: {
        cleanNull: boolean;
    };
    $or?: filterItem<T>[];
} & filterItem<T>;
export default filter;
