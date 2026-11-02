import { Pagination as AntPagination } from "antd";

interface PaginationProps {
    currentPage: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    pageSize,
    total,
    onChange,
}: PaginationProps) => {
    if (total <= pageSize) {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
            }}
        >
            <AntPagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={onChange}
                showSizeChanger={false}
                showTotal={(total) => `Total ${total} todos`}
            />
        </div>
    );
};

export default Pagination;