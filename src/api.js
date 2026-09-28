const API_BASE_URL = "http://localhost:8080";

export const apiFetch = async (url, options = {}) =>
{
    const token = localStorage.getItem("token");

    const headers =
    {
        ...options.headers,
        "Authorization": "Bearer " + token
    };


    const response = await fetch(
        API_BASE_URL + url,
        {
            ...options,
            headers: headers
        }
    );


    // Token is missing, invalid, or expired
    if(response.status === 401)
    {
        localStorage.removeItem("token");

        window.location.reload();

        return response;
    }


    // User is logged in but does not have permission
    if(response.status === 403)
    {
        console.log(
            "Access denied: You do not have permission for this action."
        );
    }


    return response;
};