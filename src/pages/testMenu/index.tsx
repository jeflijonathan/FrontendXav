const TestMenuPage = () => {
    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary-txt">Test Menu</h1>
            </div>
            
            <div className="bg-theme-secondary/40 border border-light-dark rounded-xl p-6">
                <h3 className="text-lg font-medium text-primary-txt mb-2">Halaman Uji Coba</h3>
                <p className="text-secondary-txt">
                    Ini adalah halaman menu bebas yang dibuat untuk keperluan pengujian UI dan routing.
                </p>
            </div>
        </div>
    );
};

export default TestMenuPage;
