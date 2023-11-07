import slugify from 'slugify';

export const convertToSlug = (text) => {
    return slugify(text, {
        lower: true, // Chuyển đổi sang chữ thường
        strict: true, // Chỉ giữ các ký tự an toàn trong URL
    });
};
