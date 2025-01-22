export interface ActionResponse<T> extends BaseActionReseponse {
  data?: {
    [K in keyof T]?: string | undefined;
  };
  errors?: {
    [K in keyof T]?: string[];
  };
}

export interface BaseActionReseponse {
  success: boolean;
}
